import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
 

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule,SideBarComponent,NavBarComponent, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  token:string |null;
userId:string="";
private jwtHelper = new JwtHelperService();

 constructor(private projectService: ProjectService, private route:Router,private tokenService:TokenService){
  this.token = this.tokenService.getToken();
      if (this.token) {
        const decodedToken = this.jwtHelper.decodeToken(this.token);
        this.userId = decodedToken.userId;
 }
 }
 formProject = new FormGroup({
  title :new FormControl('', [Validators.required, Validators.minLength(3),Validators.maxLength(10), this.validateTitle()]),
  description : new FormControl ('', [Validators.required, Validators.minLength(50)]),
  startDate : new FormControl('', [Validators.required,this.validateStartDate() ]),
  endDate : new FormControl('', [Validators.required,this.validateEndDate()]),
  type:new FormControl('', [Validators.required]),
  category:new FormControl('',[Validators.required]),
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
    category: FormValue.category ?? '',
    status: FormValue.status ?? 'Not Started',
    created_by: this.userId as any, // Replace 'as any' with the actual User type if available

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
    const startDateControl = group.get('startDate');
    const endDateControl = group.get('endDate');

    // Vérifier si les contrôles existent
    if (!startDateControl || !endDateControl) {
      console.log('Validator: Start or End date control not found');
      return null;
    }

    const startValue = startDateControl.value;
    const endValue = endDateControl.value;

    console.log('Validator running...');
    console.log('Raw Start Value:', startValue);
    console.log('Raw End Value:', endValue);

    // Vérifier si les valeurs sont présentes avant de créer les dates
    if (!startValue || !endValue) {
      console.log('Validator: Start or End value is missing');
      return null; // Pas d'erreur si une date manque (géré par Validators.required)
    }

    const start = new Date(startValue);
    const end = new Date(endValue);

    console.log('Parsed Start Date:', start);
    console.log('Parsed End Date:', end);

    // Vérifier si les dates sont valides après parsing
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.log('Validator: Invalid date parsing');
      return null; // Ne pas retourner d'erreur si le parsing échoue
    }

    // Comparaison des dates
    if (start >= end) {
      console.log('Validator: Error - Start date is >= End date. Returning { startAfterEnd: true }');
      return { startAfterEnd: true };
    }

    console.log('Validator: Dates are consistent. Returning null.');
    return null;
  };
}


validateTitle() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/; // Lettres, accents, tirets, apostrophes, espaces uniquement

    if (value && !regex.test(value)) {
      return { invalidTitle: true };
    }
    return null;
  };
}





}
