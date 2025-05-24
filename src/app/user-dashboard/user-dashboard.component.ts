import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; // <== important pour [(ngModel)]
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;  // utilisateur en édition
  editedUser: any = {};      // copie temporaire pour l’édition

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur chargement utilisateurs:', error);
      }
    );
  }

  editUser(user: any): void {
    this.selectedUser = user;
    this.editedUser = { ...user }; // copie pour modifier sans toucher l’original
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.editedUser = {};
  }

  saveUser(): void {
    if (!this.selectedUser) return;
    this.userService.updateUser(this.selectedUser._id, this.editedUser).subscribe(
      (updatedUser) => {
        // mettre à jour la liste localement
        const index = this.users.findIndex(u => u._id === this.selectedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
        this.editedUser = {};
        console.log('Utilisateur mis à jour');
      },
      (error) => {
        console.error('Erreur mise à jour utilisateur :', error);
      }
    );
  }

  deleteUser(userId: string): void {
    if (confirm('Confirmer la suppression ?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(u => u._id !== userId);
          console.log('Utilisateur supprimé');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l’utilisateur :', error);
        }
      );
    }
  }
}
