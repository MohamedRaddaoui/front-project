import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
 
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [SideBarComponent, NavBarComponent, CommonModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  successMessage: string | null = null; // ✅ Ajoute cette ligne
    token:string |null;
  userId:string="";
  private jwtHelper = new JwtHelperService();
 
  constructor(private projectService: ProjectService, private router:Router, private route :ActivatedRoute,private tokenService:TokenService) {
 
     this.token = this.tokenService.getToken();
      if (this.token) {
        const decodedToken = this.jwtHelper.decodeToken(this.token);
        this.userId = decodedToken.userId;
 
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['message'] || null;
      if (this.successMessage) {
        setTimeout(() => {
          this.successMessage = null;
        }, 3000); // 3 secondes
      }
    });
  }}
  listProject: Project[]=[]
 
  //extraire le date d'un date de type iso
  formatDate(isoDate: String | undefined): string {
    if (!isoDate) return 'Date invalide';
 
    const date = new Date(isoDate.toString()); // <- conversion explicite
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
 
  projectsPerPage = 6; // 2 rows × 3 columns
  currentPage = 1;
  paginatedProjects: Project[] = [];
  totalPages = 1;
  totalPagesArray: number[] = [];
 
  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.successMessage = params["message"] || null;
    // Determine the desired archived status from the route parameter
    const filterArchived = params["archived"] === "true";
    // Load and filter projects based on the status
    this.loadAndFilterProjects(filterArchived);
 
    // Handle success message display
    if (this.successMessage) {
      setTimeout(() => {
        this.successMessage = null;
      }, 3000); // 3 seconds
    }
  });
}
 
// Load and filter projects based on archived status
loadAndFilterProjects(filterArchived: boolean) {
  if (!this.userId) {
    console.error("User ID is missing, cannot load projects.");
    // Optionally handle this case, e.g., redirect to login or show an error
    return;
  }
  this.projectService.getProjectByUser(this.userId).subscribe({
    next: (projects: Project[]) => {
      // Filter the projects based on the archived status
      // Assumes projects without an "archived" property are not archived (false)
      this.listProject = projects.filter(project => (project.archived || false) === filterArchived);
 
      console.log(`Loaded ${filterArchived ? "archived" : "active"} projects:`, this.listProject);
 
      // Update pagination based on the filtered list
      this.totalPages = Math.ceil(this.listProject.length / this.projectsPerPage);
      this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      // Reset to page 1 when the filter changes or data reloads
      this.currentPage = 1;
      this.updatePaginatedProjects();
    },
    error: (err) => {
      console.error("Error loading projects:", err);
      this.listProject = []; // Clear list on error
      this.totalPages = 1;
      this.totalPagesArray = []; // Clear pages array
      this.updatePaginatedProjects(); // Update view with empty list
      // Optionally show an error message to the user
    }
  });
}
 
 
 updatePaginatedProjects() {
  const start = (this.currentPage - 1) * this.projectsPerPage;
  const end = start + this.projectsPerPage;
  this.paginatedProjects = this.listProject.slice(start, end);
 
  // Initialiser la propriété showFullDescription pour chaque projet
  this.paginatedProjects.forEach(project => {
    project.showFullDescription = false;
   
    // Initialiser l'état pour l'affichage des utilisateurs
    if (project._id !== undefined && project._id !== null) {
  if (!this.projectUsersExpandedState.has(project._id)) {
    this.projectUsersExpandedState.set(project._id, false);
  }
}
  });
}
 
 
 
  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProjects();
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProjects();
    }
  }
 
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProjects();
    }
  }
 
 
 
  onProjectClick(project: Project): void {
    console.log('Projet cliqué:', project);
    if (project.type === 'Scrum') {
      this.router.navigate(['/scrum', project._id]);
    } else if (project.type === 'Kanban') {
      this.router.navigate(['/standard', project._id]);
    } else {
      alert('Type non pris en charge');
    }
  }
 
  // Propriété pour gérer l'affichage de la description complète
 
// Méthode pour basculer l'affichage de la description complète
toggleDescription(event: Event, project: any) {
  // Empêcher la propagation du clic pour éviter d'autres actions
  event.stopPropagation();
 
  // Inverser l'état d'affichage de la description complète pour ce projet uniquement
  project.showFullDescription = !project.showFullDescription;
}
 
// Nombre maximum d'avatars à afficher avant le badge "+"
maxVisibleAvatars = 3;
 
// Map pour stocker l'état d'affichage des utilisateurs par projet
projectUsersExpandedState = new Map<string, boolean>();
 
// Méthode pour vérifier si la liste complète des utilisateurs est affichée
// Méthode pour vérifier si la liste complète des utilisateurs est affichée
isUsersExpanded(projectId: string | undefined): boolean {
  if (!projectId) return false;
  return this.projectUsersExpandedState.get(projectId) || false;
}
 
 
// Méthode pour basculer l'affichage complet des utilisateurs
toggleUsersDisplay(event: Event, project: any) {
  // Empêcher la propagation du clic
  event.stopPropagation();
 
  // Inverser l'état d'affichage des utilisateurs pour ce projet uniquement
  const currentState = this.projectUsersExpandedState.get(project.id) || false;
  this.projectUsersExpandedState.set(project.id, !currentState);
}
 
// Méthode pour obtenir le nombre d'utilisateurs supplémentaires (non affichés)
getHiddenUsersCount(project: any): number {
  if (!project.usersID || !Array.isArray(project.usersID)) {
    return 0;
  }
 
  const totalUsers = project.usersID.length;
  return Math.max(0, totalUsers - this.maxVisibleAvatars);
}
 
// Méthode pour obtenir les utilisateurs visibles
getVisibleUsers(project: any): any[] {
  if (!project.usersID || !Array.isArray(project.usersID)) {
    return [];
  }
 
  // Si la liste est développée, on retourne tous les utilisateurs
  if (this.isUsersExpanded(project.id)) {
    return project.usersID;
  }
 
  // Sinon, on limite au nombre maximal d'avatars visibles
  return project.usersID.slice(0, this.maxVisibleAvatars);
}
}
