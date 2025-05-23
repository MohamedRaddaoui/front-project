import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sprint } from '../models/sprint.model';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sprint',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css'
})
export class SprintComponent {
  constructor(private projectService: ProjectService,private route: ActivatedRoute){}

  
   @Input() visible = false;
    @Output() close = new EventEmitter<void>();
  
    formData = {
      name: '',
      email: ''
    };
  
    onSubmit() {
      console.log('Formulaire soumis:', this.formData);
      alert('Formulaire envoyé avec succès !');
      this.formData = { name: '', email: '' };
      this.close.emit();
    }
  
    closeModal() {
      this.close.emit();
    }

    sprint!:Sprint
    id!:string
    formSprint=new FormGroup({
      title:new FormControl(),
      goal:new FormControl(),
      start_date:new FormControl(),
      end_date:new FormControl(),
      status:new FormControl(),
      projectID:new FormControl(),
      backlogId:new FormControl(),
      userStories:new FormControl(),
      planning: new FormControl(),
      reviews: new FormControl(),
      retrospectives:new FormControl(),
      reviewStartTime:new FormControl(),
      reviewEndTime:new FormControl(),
      retroEndTime:new FormControl(),
      retroStartTime:new FormControl(),
      dailyEndTime:new FormControl(),
      dailyStartTime:new FormControl(),
    })
    ngOnInit(){
      this.id = this.route.snapshot.paramMap.get('id')!;
     this.formSprint.patchValue({ projectID: this.id });

    }


    addSprint(){
       this.formSprint.patchValue({ projectID: this.id });

     this.projectService.createSprint(this.id, this.formSprint.value)
    .subscribe(response => {
      console.log('Sprint créé', response);
    });

    }
    

}
