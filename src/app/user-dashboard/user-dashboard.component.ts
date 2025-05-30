import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selectedUserDetails: any = null;

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

  toggleUserStatus(user: any): void {
    const action = user.isBlocked ? 'débloquer' : 'bloquer';
    const confirmMessage = `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`;
    
    if (confirm(confirmMessage)) {
      const updatedUser = { ...user, isBlocked: !user.isBlocked };
      
      this.userService.updateUser(user._id, updatedUser).subscribe(
        (response) => {
          // Mettre à jour localement
          const index = this.users.findIndex(u => u._id === user._id);
          if (index !== -1) {
            this.users[index] = response;
          }
          
          const status = response.isBlocked ? 'bloqué' : 'débloqué';
          console.log(`Utilisateur ${status} avec succès`);
          
          // Optionnel: afficher une notification
          this.showNotification(`Utilisateur ${status} avec succès`, 'success');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          this.showNotification('Erreur lors de la mise à jour du statut', 'error');
        }
      );
    }
  }

  viewUserDetails(user: any): void {
    this.selectedUserDetails = user;
  }

  closeUserDetails(): void {
    this.selectedUserDetails = null;
  }

  getActiveUsersCount(): number {
    return this.users.filter(user => !user.isBlocked).length;
  }

  getBlockedUsersCount(): number {
    return this.users.filter(user => user.isBlocked).length;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    // Implémentation simple avec alert, vous pouvez utiliser une bibliothèque de notifications
    // comme ngx-toastr ou créer votre propre système de notifications
    if (type === 'success') {
      // Vous pouvez remplacer par une notification toast
      console.log('✅ ' + message);
    } else {
      console.error('❌ ' + message);
    }
  }
}