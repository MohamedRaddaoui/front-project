import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
 ;

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule,SideBarComponent,NavBarComponent, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {

 constructor(private projectService: ProjectService, private route:Router){}

 formProject = new FormGroup({
  title :new FormControl('', [Validators.required,Validators.minLength(3)]),
  description : new FormControl ('', [Validators.required, Validators.minLength(50)]),
  startDate : new FormControl('', [Validators.required,this.validateStartDate() ]),
  endDate : new FormControl('', [Validators.required,this.validateEndDate()]),
  type:new FormControl('', [Validators.required]),
  category:new FormControl('dev'),
  status:new FormControl('Not Started', [ Validators.pattern(/^(Not Started|In Progress|Done|Canceled)$/) 
 ]),
},{ validators: this.dateConsistencyValidator() });

addProject() {
  if (this.formProject.invalid) {
    this.formProject.markAllAsTouched();
    return;
  }

  const FormValue = this.formProject.value;
  const project: Project = {
    title: FormValue.title ?? '',
    description: FormValue.description ?? '',
    startDate: FormValue.startDate ?? '',
    endDate: FormValue.endDate ?? '',
    type: FormValue.type ?? '',
    category: FormValue.category ?? 'dev',
    status: FormValue.status ?? 'Not Started'
  };

  this.projectService.addProject(project).subscribe(() => this.route.navigateByUrl('/project'));
}

 // Validate startDate: must not be in the past
 validateStartDate() {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return { pastStartDate: true };
    }
    return null;
  };
}
 // Validate endDate: must not be in the past
 validateEndDate() {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return { pastEndDate: true };
    }
    return null;
  };
}
// Validate startDate < endDate
dateConsistencyValidator() {
  return (group: AbstractControl): ValidationErrors | null => {

    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    if (start && end && start >= end) {
      return { startAfterEnd: true };
    }
    return null;
  };
}



}
