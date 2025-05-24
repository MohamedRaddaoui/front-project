import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';  // Ajout de Router et NavigationEnd
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-project',
  imports: [SideBarComponent,NavBarComponent, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
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
    this.successMessage = params['message'] || null;

    const isArchived = params['archived'] === 'true'; // ← récupère le paramètre
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


  
  loadProjects() {
    this.projectService.getProjectByUser(this.userId).subscribe((projects) => {
      this.listProject = projects;
      console.log(this.listProject);
      this.totalPages = Math.ceil(
        this.listProject.length / this.projectsPerPage
      );
      this.totalPagesArray = Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );
      this.updatePaginatedProjects();
    });
  }


  loadArchivedProjects() {
  this.projectService.ArchiveProjectByUser().subscribe((projects) => {
      this.listProject = projects;
      console.log(this.listProject);
      this.totalPages = Math.ceil(
        this.listProject.length / this.projectsPerPage
      );
      this.totalPagesArray = Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );
      this.updatePaginatedProjects();
    });
}


  updatePaginatedProjects() {
    const start = (this.currentPage - 1) * this.projectsPerPage;
    const end = start + this.projectsPerPage;
    this.paginatedProjects = this.listProject.slice(start, end);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProjects();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProjects();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProjects();
    }
  }
  
  
  



  onProjectClick(project: any) {
    console.log('Projet cliqué:', project);
    if (project.type === 'Scrum') {
      this.router.navigate(['/scrum', project.id]);
    } else {
      if(project.type === 'Kanban'){
        this.router.navigate(['/standard', project.id])

      }else{
      // autre traitement ou message d’erreur
      alert('Type non pris en charge');
    }
  }}
  

}
