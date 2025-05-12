import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router'; // Ajout de Router et NavigationEnd
import { filter } from 'rxjs/operators'; // Ajout du pipe
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project',
  imports: [SideBarComponent, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  constructor(private projectService: ProjectService) {}
  listProject: Project[] = [];

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
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAllProject().subscribe((projects) => {
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
}
