import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StandardProjectComponent } from '../standard-project/standard-project.component';
import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-scrum-project',
  imports: [CommonModule,StandardProjectComponent,RouterLink],
  templateUrl: './scrum-project.component.html',
  styleUrl: './scrum-project.component.css'
})
export class ScrumProjectComponent {

  constructor(private projectService:ProjectService, private route: ActivatedRoute){}
  @Input() sprints: any[] = [];
  @Input() project!: Project;
    @Input() isScrum: boolean = false;

  projetId! :string;
  id!: string;

    ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.projectService.getByIdProject(this.id).subscribe((data: Project) => {
        this.project = data;
      });
    }
  
  }

}
