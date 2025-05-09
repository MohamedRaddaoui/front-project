import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-project',
  imports: [CommonModule],
  templateUrl: './delete-project.component.html',
  styleUrl: './delete-project.component.css'
})
export class DeleteProjectComponent {

  constructor(private route:ActivatedRoute,private projectService: ProjectService, private router: Router) { }


  project!: Project;
  
  id!:string;

  visible = false;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  confirm() {
    
    if (this.id) {
      this.projectService.deleteProject(this.id).subscribe({
        next: () => {
          console.log("Suppression confirmée");
          this.router.navigate(['/'], {
            queryParams: { message: 'Project deleted successfully' }
          });
        },
        error: (err) => {
          console.error('Erreur de suppression :', err);
        }
      });
    }
    this.close();
  }
  

}



  
   