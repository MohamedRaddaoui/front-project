import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Sprint } from '../models/sprint.model';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-detail-sprint',
  imports: [CommonModule,SideBarComponent,NavBarComponent],
  templateUrl: './detail-sprint.component.html',
  styleUrl: './detail-sprint.component.css'
})
export class DetailSprintComponent {
  constructor(private projectService:ProjectService,private route :ActivatedRoute){}





  
  sprint!:Sprint
  
     ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.projectService.getSprintById(id).subscribe({
       next: (data) => {
  console.log('--- DEBUG SPRINT DATA ---');
  console.log('Received data:', data);
  console.log('Type of data.projectID:', typeof data.projectID);
  console.log('Value of data.projectID:', data.projectID);
  console.log('Does data.projectID have title?', data.projectID?.hasOwnProperty('title'));
  console.log('--- END DEBUG ---');
  this.sprint = data;
},

        error: (error) => {
          console.error("Erreur lors de la récupération du sprint:", error);
        }
      });
    }
  }


}
