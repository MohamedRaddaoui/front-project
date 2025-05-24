import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { title } from 'process';
import { Backlog } from '../models/backlog.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-backlog',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent {
  constructor(private projectService :ProjectService,private route:ActivatedRoute){ }


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
  
 backlog!:Backlog
  formBacklog=new FormGroup({
    title:new FormControl(),
    description:new FormControl(),
    projectID: new FormControl(),
    userStoriesId: new FormControl()
  })

id!: string;

ngOnInit() {
  this.id = this.route.snapshot.paramMap.get('id')!;
  this.formBacklog.patchValue({ projectID: this.id });
}

addBacklog() {
  this.formBacklog.patchValue({ projectID: this.id });

  this.projectService.createBacklog(this.id, this.formBacklog.value)
    .subscribe(response => {
      console.log('Backlog créé', response);
    });
}



  

}
