import { Component, ElementRef, Input, TemplateRef, ViewChild, OnInit, input } from '@angular/core'; // Added OnInit
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component'; // Assumes this is for Project deletion
// Import your generic delete component here if needed, e.g.:
// import { DeleteComponent } from '../shared/delete/delete.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AssignUserComponent } from '../assign-user/assign-user.component';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';

@Component({
  selector: 'app-standard-project',
  templateUrl: './standard-project.component.html',
  standalone:true,
  styleUrls: ['./standard-project.component.css'],
  // Add your generic DeleteComponent to imports if it's not standalone or globally provided
  imports: [
    CommonModule,
    SideBarComponent, 
    NavBarComponent,
    DeleteProjectComponent,  // Uncomment if needed for user deletion
    AssignUserComponent, 
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  // Corrected from styleUrl
})
export class StandardProjectComponent implements OnInit { // Implemented OnInit

  token: string | null;
  userId: string = "";
  role!: string; // Consider initializing or ensuring it's set before use
  private jwtHelper = new JwtHelperService();

  @Input() customTasksTemplate?: TemplateRef<any>;
  @Input() project!: Project;
  @Input() isScrum: boolean = false;
  @ViewChild('addIcon', { static: false }) addIconRef!: ElementRef;

  id!: string;
  editedProject!: Project;
  isEditing: boolean = false;
  showAddPopup = false;
  popupPosition = { top: '0px', left: '0px' };
  assignedUsers: User[] = []; // Consider if this is needed if project.usersID is the source of truth
  
  // --- Properties for Project Deletion Popup ---
  popupVisible = false; 

  // --- Properties for User Deletion Popup (using app-delete) ---
  showRemoveUserPopup = false;
  userToRemoveId: string | null = null;
  removeUserPopupTitle: string = '';
  removeUserPopupMessage: string = '';
  // --- End User Deletion Popup Properties ---

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.token = this.tokenService.getToken();
    if (this.token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(this.token);
        this.userId = decodedToken.userId;
        // You might want to extract the role here as well if needed elsewhere
        // this.role = decodedToken.role;
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle invalid token, e.g., logout user
        this.tokenService.removeToken();
        this.router.navigate(['/login']); // Or appropriate route
      }
    }
  }

  ngOnInit(): void { // Correct signature for OnInit
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loadProjectDetails(); // Load details on init
    } else {
      console.error("Project ID is missing from route parameters.");
      // Handle missing ID, e.g., navigate back or show error
    }
  }

  loadProjectDetails(): void {
    if (!this.id) return; // Prevent loading without ID
    this.projectService.getByIdProject(this.id).subscribe({
      next: (data: Project) => {
        this.project = data;
        // Ensure usersID is an array
        this.project.usersID = this.project.usersID || []; 
        // Update assignedUsers if you use it separately, otherwise remove it
        this.assignedUsers = [...this.project.usersID]; 
      },
      error: (err) => {
        console.error("Error loading project details:", err);
        // Handle error, e.g., show message to user, navigate away
      }
    });
     this.showAllUsers = false; 
  }

  formatDate(isoDate: String | undefined | null): string {
    if (!isoDate) return 'Date non spécifiée'; // Handle null/undefined
    try {
      const date = new Date(isoDate.toString());
      if (isNaN(date.getTime())) { // Check for invalid date
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", isoDate, e);
      return 'Date invalide';
    }
  }

  // --- Project Archiving ---
  archiveProject(): void { // Renamed function
    if (!this.id || !this.project) {
      console.error("Cannot archive project: ID or project data missing.");
      return;
    }
    // Call updateProject with the archived flag set to true
    const archiveUpdate = { archived: true };
    this.projectService.updateProject(this.id, archiveUpdate).subscribe({
      next: (updatedProject: Project) => { // Assuming updateProject returns the updated project
        console.log('Project archived successfully');
        // Update local project state if the service call returns the updated object
        this.project = updatedProject;
        // Navigate to a more relevant page like the project list
        this.router.navigate(['/project'], {
          queryParams: { message: 'Project archived successfully' }
        });
      },
      error: (err) => {
        console.error("Error archiving project:", err);
        // Consider implementing user-facing error feedback
      }
    });
  }

  // --- Project Editing --- 
  editProject(): void {
    this.isEditing = true;
    this.editedProject = { ...this.project }; // Create a copy for editing
  }

  saveProject(): void {
    if (!this.id || !this.editedProject) return;
    this.projectService.updateProject(this.id, this.editedProject).subscribe({
      next: (updatedProject: Project) => {
        this.project = updatedProject; // Update the main project object
        this.isEditing = false;
        console.log("Project updated successfully");
        // Optionally show success message
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du projet:', err);
        // Show error message to user
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    // No need to revert editedProject unless you want to clear it
  }

  // --- User Assignment Popup --- 
  openAddUserPopup(event: MouseEvent): void {
    if (!this.addIconRef) return;
    this.showAddPopup = true;
    const rect = (this.addIconRef.nativeElement as HTMLElement).getBoundingClientRect();
    // Position relative to viewport, adjust if needed based on container scrolling
    this.popupPosition = {
      top: `${rect.bottom}px`, // Position below the icon
      left: `${rect.left}px`
    };
  }

  closeAddUserPopup(): void {
    this.showAddPopup = false;
  }

  onUserAssigned(user: User): void { // Expecting a User object
    console.log("User assigned event received:", user);
    // Instead of pushing locally, reload project data to get the updated list from backend
    this.loadProjectDetails(); 
    this.closeAddUserPopup(); // Close popup after assignment
  }

  // --- Project Deletion Popup (using app-delete-project) ---
  openPopup(): void {
    this.popupVisible = true;
  }

  cancelDelete(): void {
    this.popupVisible = false;
  }

  confirmDelete(): void {
    if (!this.id) return;
    this.projectService.deleteProject(this.id).subscribe({
      next: () => {
        console.log("Project deletion confirmed");
        this.router.navigate(['/project'], { // Navigate to project list or dashboard
          queryParams: { message: 'Project deleted successfully' }
        });
      },
      error: (err) => {
        console.error('Erreur de suppression du projet:', err);
        this.popupVisible = false; // Close popup even on error?
        // Show error message to user
      }
    });
    // It's generally better to close the popup *after* the operation completes (in next/error)
    // this.popupVisible = false; 
  }

  // --- User Deletion Popup (using generic app-delete) ---
  requestRemoveUser(userIdToRemove: string, userName: string): void {
    if (!userIdToRemove) return;
    this.userToRemoveId = userIdToRemove;
    this.removeUserPopupTitle = 'Retirer l\'utilisateur ?'; // Escaped apostrophe
    this.removeUserPopupMessage = `Êtes-vous sûr de vouloir retirer ${userName || 'cet utilisateur'} de ce projet ?`;
    this.showRemoveUserPopup = true; // Show the generic delete popup
  }

  confirmRemoveUser(): void {
    if (!this.userToRemoveId || !this.id) {
      console.error("User ID or Project ID missing for removal.");
      this.resetRemoveUserState();
      return;
    }

    const userIdBeingRemoved = this.userToRemoveId;
    this.projectService.unassignUser(this.id, userIdBeingRemoved).subscribe({
      next: () => {
        console.log(`User ${userIdBeingRemoved} removed from project ${this.id}`);
        // Update UI by filtering the local array
        if (this.project && this.project.usersID) {
             this.project.usersID = this.project.usersID.filter(user => user._id !== userIdBeingRemoved);
             this.assignedUsers = [...this.project.usersID]; // Update the other list too if used
        }
        // Optionally show success notification
        this.resetRemoveUserState(); 
      },
      error: (err) => {
        console.error(`Error removing user ${userIdBeingRemoved}:`, err);
        // Optionally show error notification
        this.resetRemoveUserState(); // Reset state even on error
      }
    });
  }

  cancelRemoveUser(): void {
     this.resetRemoveUserState();
  }

  private resetRemoveUserState(): void {
    this.showRemoveUserPopup = false;
    this.userToRemoveId = null;
    this.removeUserPopupTitle = '';
    this.removeUserPopupMessage = '';
  }
  // --- End User Deletion --- 

  // --- Role Checks --- 
  isManager(): boolean {
   if (!this.project?.created_by?._id || !this.userId) {
     console.log('isManager check: Missing project, created_by, or userId');
     return false;
   }
   const result = this.project.created_by._id === this.userId;
   // !! REGARDEZ CETTE LIGNE DANS LA CONSOLE DU NAVIGATEUR !!
   console.log('isManager check:', result, ' (User ID:', this.userId, 'Creator ID:', this.project.created_by._id, ')');
   return result;
 }


  isProjectManager(): boolean {
    // Ensure project and ownerID are loaded before checking
    if (!this.project?.ownerID?._id || !this.userId) {
      return false;
    }
    return this.project.ownerID._id === this.userId;
  }



   showAllUsers: boolean = false;
  initialUserLimit: number = 4; 
  // MODIFIÉ : Méthode pour basculer l'affichage des utilisateurs
  toggleUserDisplay(): void {
    this.showAllUsers = !this.showAllUsers; // Inverse la valeur actuelle
  }

  // Inchangé : Méthode pour calculer le nombre d'utilisateurs cachés
  getHiddenUserCount(): number {
    if (!this.project || !this.project.usersID) {
      return 0;
    }
    const totalUsers = this.project.usersID.length;
    // Ne retourne un compte que si on est en mode réduit ET qu'il y a plus d'utilisateurs que la limite
    return !this.showAllUsers && totalUsers > this.initialUserLimit ? totalUsers - this.initialUserLimit : 0;
  }
  
  // Helper pour savoir s'il y a plus d'utilisateurs que la limite initiale
  hasMoreUsersThanLimit(): boolean {
     if (!this.project || !this.project.usersID) {
      return false;
    }
    return this.project.usersID.length > this.initialUserLimit;
  }
}

