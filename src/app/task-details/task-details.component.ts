import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { CommentService } from '../services/comment.service';

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
    projectId: '', // This should be set based on current project
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
  // Pour utilisation future avec l'authentification
  // currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.fetchTask(params['id']);
      } else {
        this.isCreateMode = true;
        // Set projectId from route or state management
        this.task.projectId = this.route.snapshot.queryParams['projectId'];
      }
    });
    this.fetchUsers();
    this.fetchProjects();
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
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error fetching task';
        console.error('Error fetching task:', error);
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
    this.showDeleteModal = true;
  }

  confirmDelete() {
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
      formData.append('userId', this.task.assignedUser); // Utiliser l'ID de l'utilisateur assigné
      formData.append('text', this.newComment.text);

      // Append files if any
      this.newComment.files.forEach((file) => {
        formData.append('files', file);
      });

      this.commentService.addComment(formData).subscribe({
        next: (response) => {
          if (response.isFlagged) {
            this.errorMessage = 'Comment added but flagged as inappropriate';
          }
          // Update the task's comments array with the new comment
          this.task.comments.push(response.comment);
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
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(this.task._id, commentId).subscribe({
        next: () => {
          this.task.comments = this.task.comments.filter(
            (comment: any) => comment._id !== commentId
          );
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error deleting comment';
          console.error('Error deleting comment:', error);
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
}
