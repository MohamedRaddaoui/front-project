import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Backlog } from '../models/backlog.model';

@Component({
  selector: 'app-details-backlog',
  imports: [CommonModule,SideBarComponent,NavBarComponent],
  templateUrl: './details-backlog.component.html',
  styleUrl: './details-backlog.component.css'
})
export class DetailsBacklogComponent {
  constructor(private projectService:ProjectService,private route:ActivatedRoute) { }



productBacklog!:Backlog 

    ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // récupère l'id depuis l'URL
    if (id) {
      this.projectService.getBacklogByID(id).subscribe({
        next: (data) => {
          this.productBacklog = data;
        },
        error: (error) => {
          console.error('Erreur :', error);
        }
      });
    }
  }
   

}
