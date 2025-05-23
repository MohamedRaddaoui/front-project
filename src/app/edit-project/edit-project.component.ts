import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router,  } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-edit-project',
  imports: [SideBarComponent,NavBarComponent, CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {

  constructor(private projectService: ProjectService, private route : ActivatedRoute,private router:Router ){}
     

  project!:Project;
  id!:string;

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
  ngOnInit(){
    //recuperer l'id depuis l'url
    this.id=this.route.snapshot.params['id']
    //recupere le produit a partir de l'id
    this.projectService.getByIdProject(this.id).subscribe(
      (data)=>{
        this.project=data,
        //remplire le formulaire par les donner du produit
        this.formProject.patchValue({
      title: this.project.title,
      description: this.project.description,
      startDate: this.project.startDate ? this.formatDate(this.project.startDate as string) : '',
      endDate: this.project.endDate ? this.formatDate(this.project.endDate as string) : '',
      type: this.project.type,
      category: this.project.category,
      status: this.project.status
    });
      }
    )
  }


  updateProject(){
    this.projectService.updateProject(this.id,this.formProject.value as any).subscribe(
      ()=>this.router.navigate(['/'], {
            queryParams: { message: 'Project updateted successfully' }
          })
    )

  }


   formatDate(date: string | Date): string {
  const d = new Date(date);
  const iso = d.toISOString(); // format complet avec secondes
  return iso.substring(0, 16); // extrait jusqu'à 'YYYY-MM-DDTHH:mm'
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

