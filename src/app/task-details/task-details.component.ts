import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CommentService } from '../services/comment.service';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from '../services/auth.service';

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
    // Static project list for now
    this.projects = [
      { _id: '67f7a640d4ce6fae00468f18', name: 'Application dev' },
      { _id: '68014b8ea4e327735c69ec8f', name: 'project test mail' },
      { _id: '68150a984ed88e831b86d362', name: 'test' }
    ];
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
        this.task.comments = response.comments || [];
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.errorMessage = 'Error loading comments';
      }
    });
  }

  fetchUsers() {
    // TODO: Implement user service to fetch users
    this.users = [
      { _id: '67d99644b4e02ca9a8b0991f', firstname: 'Mohamed', lastname: 'Raddaoui' },
      { _id: '67dea703b0a765d6ff287d98', firstname: 'jean', lastname: 'philip' }
    ];
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
      this.taskService.updateTask(this.task._id, this.task).subscribe({
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
      formData.append('userId', this.task.assignedUser);
      formData.append('text', this.newComment.text);

      this.newComment.files.forEach((file) => {
        formData.append('files', file);
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

  editComment(comment: any) {
    // TODO: Implement comment editing
    console.log('Edit comment:', comment);
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
        },
        error: (error) => {
          console.error('Error loading task history:', error);
        }
      });
    }
  }

  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      assignedUser: 'Assigned User',
      dueDate: 'Due Date',
      tags: 'Tags'
    };
    return labels[field] || field;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }

  switchTab(tab: 'comments' | 'history') {
    this.activeTab = tab;
  }
}
