import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [SideBarComponent,CommonModule,FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit  {
  task: any = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    assignedUser: '',
    comments: []
  };

  users: any[] = []; // à remplacer par les utilisateurs du backend
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['To Do', 'In Progress', 'Done'];
  isEditMode = false;
  newComment = {
    text: '',
    files: []
  };
  showCommentForm: boolean = false;

  constructor() { }

  ngOnInit() {
    this.fetchUsers();
    // charger les tâches si besoin
  }

  fetchUsers() {
    // Appel à ton API pour récupérer les utilisateurs
  }

  onSubmit() {
    if (this.isEditMode) {
      // Mettre à jour la tâche via l'API
    } else {
      // Créer une nouvelle tâche via l'API
    }
  }

  deleteTask() {
    // Supprimer la tâche via l'API
  }

  addComment() {
    if (this.newComment.text.trim()) {
      const commentToAdd = {
        text: this.newComment.text,
        files: this.newComment.files
      };
      // Envoyer le commentaire via l'API
      this.task.comments.push({
        user: { firstname: 'Moi' },
        text: this.newComment.text,
        sentiment: 'pending...'
      });
      this.showCommentForm = false;
      this.newComment.text = '';
      this.newComment.files = [];
    }
  }

  editComment(comment: any) {
    // Logic to edit comment
  }

  deleteComment(commentId: string) {
    // Supprimer le commentaire via l'API
  }

  onFileSelected(event: any) {
    this.newComment.files = Array.from(event.target.files);
  }

  onEdit(): void {
    // Handle edit action
  }

  onShare(): void {
    // Handle share action
  }
}
