import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scrum-project',
  imports: [CommonModule,SideBarComponent],
  templateUrl: './scrum-project.component.html',
  styleUrl: './scrum-project.component.css'
})
export class ScrumProjectComponent {

  constructor(private route: ActivatedRoute){}

  projetId! :string;
  ngOnInit(): void {
    this.projetId = this.route.snapshot.paramMap.get('id') ??'';
    // Charger les infos du projet ici
  }

}
