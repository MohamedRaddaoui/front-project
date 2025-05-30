import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environment/env';

@Component({
  selector: 'app-task-details',
  imports: [SideBarComponent, CommonModule, FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  showDeleteModal = false;
  task: any = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    assignedUser: '',
    projectId: '',
    userId: '',
    comments: []
  };

  users: any[] = [];
  projects: any[] = [];
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['To Do', 'In Progress', 'Done'];
  isEditMode = false;
  isCreateMode = false;
  newComment = {
    text: '',
    files: [] as File[]
  };
  showCommentForm: boolean = false;
  editingComment: any = null;
  errorMessage: string = '';
  taskHistory: TaskHistory[] = [];
  activeTab: 'comments' | 'history' = 'comments';
  // Pour utilisation future avec l'authentification
  // currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService,
    private userService: UserService,
    private projectService: ProjectService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.fetchTask(params['id']);
      } else {
        this.isCreateMode = true;
        this.task.projectId = this.route.snapshot.queryParams['projectId'];
        this.task.userId = this.authService.getCurrentUserId();
      }
    });
    this.fetchUsers();
    this.fetchProjects();
    this.loadTaskHistory();
  }

  fetchProjects() {
    this.projectService.getAllProject().subscribe({
      next: (response) => {
        this.projects = response;
        console.log('Projects loaded:', this.projects);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.errorMessage = 'Error loading projects';
      }
    });
  }

  fetchTask(id: string) {
    this.taskService.getTaskById(id).subscribe({
      next: (response) => {
        this.task = response.task;
        // Après avoir chargé la tâche, charger les commentaires
        this.loadComments(id);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error fetching task';
        console.error('Error fetching task:', error);
      }
    });
  }

  loadComments(taskId: string) {
    this.commentService.getCommentsByTaskId(taskId).subscribe({
      next: (response) => {
        console.log('Comments loaded:', response);
        // Sort comments by date, newest first
        this.task.comments = (response.comments || []).sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.errorMessage = 'Error loading comments';
      }
    });
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Error loading users';
      }
    });
  }

  onEdit() {
    if (!this.authService.canEditTask(this.task.userId)) {
      this.errorMessage = 'Vous n\'avez pas la permission de modifier cette tâche';
      return;
    }
    this.isEditMode = true;
  }

  onSubmit() {
    if (!this.task.title.trim()) {
      this.errorMessage = 'Title is required';
      return;
    }

    if (!this.task.projectId) {
      this.errorMessage = 'Project ID is required';
      return;
    }

    if (this.isCreateMode) {
      if (!this.authService.canAddTask()) {
        this.errorMessage = 'Vous n\'avez pas la permission d\'ajouter une nouvelle tâche';
        return;
      }
      this.taskService.createTask(this.task).subscribe({
        next: (response) => {
          console.log('Task created:', response);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error creating task';
          console.error('Error creating task:', error);
        }
      });
    } else {
      if (!this.authService.canEditTask(this.task.userId)) {
        this.errorMessage = 'Vous n\'avez pas la permission de modifier cette tâche';
        return;
      }

      // Create update object with only necessary fields
      interface TaskUpdate {
        title: string;
        description?: string;
        status: string;
        priority: string;
        tags?: string;
        projectId: string;
        assignedUser?: string;
        dueDate?: string;
      }

      const taskUpdate: TaskUpdate = {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        tags: this.task.tags,
        projectId: this.task.projectId,
        assignedUser: this.task.assignedUser
      };

      // Only include dueDate if it exists
      if (this.task.dueDate) {
        taskUpdate.dueDate = this.task.dueDate;
      }

      this.taskService.updateTask(this.task._id, taskUpdate).subscribe({
        next: (response) => {
          console.log('Task updated:', response);
          this.isEditMode = false;
          this.task = response.task;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error updating task';
          console.error('Error updating task:', error);
        }
      });
    }
  }

  onDelete() {
    if (!this.authService.canDeleteTask(this.task.userId)) {
      this.errorMessage = 'Vous n\'avez pas la permission de supprimer cette tâche';
      return;
    }
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.authService.canDeleteTask(this.task.userId)) {
      this.errorMessage = 'Vous n\'avez pas la permission de supprimer cette tâche';
      return;
    }
    this.taskService.deleteTask(this.task._id).subscribe({
      next: () => {
        console.log('Task deleted successfully');
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error deleting task';
        console.error('Error deleting task:', error);
      }
    });
  }

  addComment() {
    if (this.newComment.text.trim() && this.task.assignedUser) {
      const formData = new FormData();
      formData.append('taskId', this.task._id);
      formData.append('userId', this.authService.getCurrentUserId() ?? this.task.assignedUser);
      formData.append('text', this.newComment.text);

      this.newComment.files.forEach((file) => {
        formData.append('attachments', file);
      });

      this.commentService.addComment(formData).subscribe({
        next: (response) => {
          if (response.isFlagged) {
            this.errorMessage = 'Comment added but flagged as inappropriate';
          }
          // Recharger tous les commentaires après l'ajout
          this.loadComments(this.task._id);
          
          // Reset the form
          this.showCommentForm = false;
          this.newComment.text = '';
          this.newComment.files = [];
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error adding comment';
          console.error('Error adding comment:', error);
        }
      });
    } else if (!this.task.assignedUser) {
      this.errorMessage = 'Please assign a user to the task before adding comments';
    }
  }

  startEditComment(comment: any) {
    this.editingComment = {
      ...comment,
      editText: comment.text
    };
  }

  cancelEditComment() {
    this.editingComment = null;
  }

  updateComment(comment: any) {
    if (!comment.editText.trim()) {
      this.errorMessage = 'Comment text cannot be empty';
      return;
    }

    const updatedComment = {
      text: comment.editText,
      taskId: this.task._id,
      userId: this.authService.getCurrentUserId()
    };

    console.log('Updating comment:', {
      commentId: comment._id,
      data: updatedComment
    });

    this.commentService.updateComment(comment._id, updatedComment).subscribe({
      next: (response) => {
        console.log('Comment updated successfully:', response);
        this.loadComments(this.task._id);
        this.editingComment = null;
      },
      error: (error) => {
        console.error('Error updating comment:', error);
        this.errorMessage = error.error?.message || 'Error updating comment';
      }
    });
  }

  canEditComment(comment: any): boolean {
    return this.authService.canEditComment(comment.userId);
  }

  deleteComment(commentId: string) {
    console.log('Deleting comment with ID:', commentId);
    console.log('Task ID:', this.task._id);
    
    if (!commentId || !this.task._id) {
      this.errorMessage = 'Invalid comment or task ID';
      return;
    }

    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(this.task._id, commentId).subscribe({
        next: () => {
          console.log('Comment deleted successfully');
          // Recharger les commentaires après la suppression
          this.loadComments(this.task._id);
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          this.errorMessage = error.error?.message || 'Error deleting comment';
        }
      });
    }
  }

  deleteAttachment(commentId: string, attachmentId: string) {
    this.commentService.deleteAttachment(commentId, attachmentId).subscribe({
      next: () => {
        const comment = this.task.comments.find((c: any) => c._id === commentId);
        if (comment) {
          comment.attachments = comment.attachments.filter(
            (att: any) => att._id !== attachmentId
          );
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error deleting attachment';
        console.error('Error deleting attachment:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.newComment.files = Array.from(files);
  }

  // Helper method to display file size
  formatFileSize(size: number): string {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  loadTaskHistory() {
    if (this.task._id) {
      this.taskService.getTaskHistory(this.task._id).subscribe({
        next: (history) => {
          this.taskHistory = history;
          console.log('Loaded task history:', history);
        },
        error: (error) => {
          console.error('Error loading task history:', error);
          this.errorMessage = 'Failed to load task history';
        }
      });
    }
  }

  getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      title: 'Titre',
      description: 'Description',
      status: 'Statut',
      priority: 'Priorité',
      assignedUser: 'Assigné à',
      projectId: 'Projet',
      tags: 'Tags',
      dueDate: 'Date d\'échéance'
    };
    return labels[key] || key;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'Non défini';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'object' && value._id) {
      return value.email || value.name || value.title || value._id;
    }
    return String(value);
  }

  switchTab(tab: 'comments' | 'history') {
    this.activeTab = tab;
    if (tab === 'history') {
      this.loadTaskHistory();
    }
  }

  getDownloadUrl(commentId: string, attachmentId: string): string {
    return `${environment.baseUrl}/taskcomments/${commentId}/attachments/${attachmentId}`;
  }
}
