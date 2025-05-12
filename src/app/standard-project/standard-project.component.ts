import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-standard-project',
  imports: [CommonModule,SideBarComponent,DeleteProjectComponent,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './standard-project.component.html',
  styleUrl: './standard-project.component.css'
})
export class StandardProjectComponent {


  constructor(private projectService:ProjectService ,private route: ActivatedRoute,private router:Router){}

  project!: Project;

  id!:string


  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.projectService.getByIdProject(this.id).subscribe((data: Project) => {
        this.project = data;
      });
    }
  
  }


  formatDate(isoDate: String | undefined): string {
    if (!isoDate) return 'Date invalide';
  
    const date = new Date(isoDate.toString()); // <- conversion explicite
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }


  archivedFunction(){
    this.projectService.archiveProject(this.id,this.project).subscribe()
    console.log('archived successful')
    this.router.navigate(['/'], {
      queryParams: { message: 'Project archived successfully' }
    })
  }
  editedProject!: Project;

  isEditing: boolean = false;

  editProject() {
    this.isEditing = true;
    this.editedProject = { ...this.project };
  }

  saveProject() {
    this.projectService.updateProject(this.id, this.editedProject).subscribe({
      next: (updatedProject:Project) => {
        this.project = updatedProject;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
  }
 
  




  
}