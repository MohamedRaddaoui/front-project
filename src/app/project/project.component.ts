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
  maxVisibleAvatars = 3;
  projectUsersExpandedState = new Map<string, boolean>();

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

  updatePaginatedProjects(): void {
    const start = (this.currentPage - 1) * this.projectsPerPage;
    const end = start + this.projectsPerPage;
    this.paginatedProjects = this.listProject.slice(start, end);

    this.paginatedProjects.forEach(project => {
      project.showFullDescription = false;

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
  }

  toggleDescription(event: Event, project: any): void {
    event.stopPropagation();
    project.showFullDescription = !project.showFullDescription;
  }

  isUsersExpanded(projectId: string | undefined): boolean {
    if (!projectId) return false;
    return this.projectUsersExpandedState.get(projectId) || false;
  }

  toggleUsersDisplay(event: Event, project: any): void {
    event.stopPropagation();
    const currentState = this.projectUsersExpandedState.get(project.id) || false;
    this.projectUsersExpandedState.set(project.id, !currentState);
  }

  getHiddenUsersCount(project: any): number {
    if (!project.usersID || !Array.isArray(project.usersID)) {
      return 0;
    }

    const totalUsers = project.usersID.length;
    return Math.max(0, totalUsers - this.maxVisibleAvatars);
  }

  getVisibleUsers(project: any): any[] {
    if (!project.usersID || !Array.isArray(project.usersID)) {
      return [];
    }

    if (this.isUsersExpanded(project.id)) {
      return project.usersID;
    }

    return project.usersID.slice(0, this.maxVisibleAvatars);
  }
}
