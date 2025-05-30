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
export class ProjectComponent implements OnInit {
  successMessage: string | null = null;
  token: string | null = null;
  userId: string = '';
  role: string = '';
  listProject: Project[] = [];
  paginatedProjects: Project[] = [];
  projectsPerPage = 6;
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];

  private jwtHelper = new JwtHelperService();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    this.token = this.tokenService.getToken();

    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.userId = decodedToken.userId;
      this.role = decodedToken.role;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['message'] || null;
      const isArchived = params['archived'] === 'true';

      if (isArchived) {
        this.loadArchivedProjects();
      } else {
        this.loadProjects();
      }

      if (this.successMessage) {
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }
    });
  }

  loadProjects(): void {
    if (this.role === 'admin') {
      this.projectService.getAllProject().subscribe(projects => {
        this.listProject = projects;
        this.setupPagination();
      });
    } else {
      this.projectService.getProjectByUser(this.userId).subscribe(projects => {
        this.listProject = projects;
        this.setupPagination();
      });
    }
  }

  loadArchivedProjects(): void {
    this.projectService.ArchiveProjectByUser().subscribe(projects => {
      this.listProject = projects;
      this.setupPagination();
    });
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.listProject.length / this.projectsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePaginatedProjects();
  }
  
 updatePaginatedProjects() {
  const start = (this.currentPage - 1) * this.projectsPerPage;
  const end = start + this.projectsPerPage;
  this.paginatedProjects = this.listProject.slice(start, end);
  
  // Initialiser la propriété showFullDescription pour chaque projet
  this.paginatedProjects.forEach(project => {
    project.showFullDescription = false;
    
    // Initialiser l'état pour l'affichage des utilisateurs
    if (project.id !== undefined && project.id !== null) {
  if (!this.projectUsersExpandedState.has(project.id)) {
    this.projectUsersExpandedState.set(project.id, false);
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

  formatDate(isoDate: string | undefined): string {
    if (!isoDate) return 'Date invalide';
    const date = new Date(isoDate.toString());
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  onProjectClick(project: Project): void {
    console.log('Projet cliqué:', project);
    if (project.type === 'Scrum') {
      this.router.navigate(['/scrum', project.id]);
    } else if (project.type === 'Kanban') {
      this.router.navigate(['/standard', project.id]);
    } else {
      alert('Type non pris en charge');
    }
  }}
  
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
