import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Backlog } from '../models/backlog.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-backlog',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent implements OnInit {
  constructor(private projectService: ProjectService, private route: ActivatedRoute,private router :Router) { }

  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  formData = {
    name: '',
    email: ''
  };

  backlog!: Backlog;
  projectName: string = '';
  
  formBacklog = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    projectID: new FormControl(''),
    userStoriesId: new FormControl([])
  });

  id!: string;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.formBacklog.patchValue({ projectID: this.id });
    
    // Récupérer les détails du projet pour obtenir son nom
    this.projectService.getByIdProject(this.id).subscribe(
      (project) => {
        if (project && project.title) {
          this.projectName = project.title;
          // Pré-remplir le champ titre avec "Backlog de [nom du projet]"
          this.formBacklog.patchValue({ 
            title: `Backlog de ${this.projectName}` 
          });
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du projet:', error);
      }
    );
  }

  onSubmit() {
    console.log('Formulaire soumis:', this.formData);
    alert('Formulaire envoyé avec succès !');
    this.formData = { name: '', email: '' };
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }

addBacklog() {
  this.formBacklog.patchValue({ projectID: this.id });

  // Créer un objet Backlog correctement typé à partir des valeurs du formulaire
  const backlogData: Backlog = {
    title: this.formBacklog.value.title || '',
    description: this.formBacklog.value.description || '',
    // Créer un objet Project avec l'ID
    projectID: { _id: this.id } as any, // ou le type Project exact selon votre modèle
    userStoriesId: this.formBacklog.value.userStoriesId || []
  };

  this.projectService.createBacklog(this.id, backlogData)
    .subscribe(response => {
      console.log('Backlog créé', response);
      this.close.emit(); // Fermer le modal après création

       // 👉 Recharger la page actuelle
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    });
    
}


}
