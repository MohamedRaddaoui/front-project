import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink,  } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-edit-project',
  imports: [SideBarComponent,NavBarComponent, CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {

  constructor(private projectService: ProjectService, private route : ActivatedRoute,private router:Router ){}
     

  project!:Project;
  id!:string;

   formProject = new FormGroup({
    title :new FormControl('', [Validators.required,Validators.minLength(3),this.validateTitle()]),
    description : new FormControl ('', [Validators.required, Validators.minLength(50)]),
    startDate : new FormControl('', [Validators.required,this.validateStartDate() ]),
    endDate : new FormControl('', [Validators.required,this.validateEndDate()]),
    type:new FormControl('', [Validators.required]),
    category:new FormControl(),

    status:new FormControl('Not Started', [ Validators.pattern(/^(Not Started|In Progress|Done|Canceled)$/)
   ]),
   allowCancel: new FormControl(false)  // <-- Ajouté ici
  },{ validators: this.dateConsistencyValidator() });
ngOnInit() {
  this.id = this.route.snapshot.params['id'];

  this.projectService.getByIdProject(this.id).subscribe((data) => {
    this.project = data;
    this.formProject.patchValue({
      title: this.project.title,
      description: this.project.description,
      startDate: this.project.startDate ? this.formatDate(this.project.startDate as string) : '',
      endDate: this.project.endDate ? this.formatDate(this.project.endDate as string) : '',
      type: this.project.type,
      category: this.project.category,
      status: this.project.status,
      allowCancel: this.project.status === 'Canceled'
    });

    // Écouter les changements sur allowCancel
    this.formProject.get('allowCancel')?.valueChanges.subscribe((checked) => {
      if (!checked) {
        // Si décoché ET que le status est 'Canceled', changer le status
        if (this.formProject.get('status')?.value === 'Canceled') {
          this.formProject.get('status')?.setValue('Not Started'); // ou autre statut par défaut
        }
      } else {
        // Optionnel : si on coche la checkbox, on peut mettre le status à 'Canceled' automatiquement
        this.formProject.get('status')?.setValue('Canceled');
      }
    });
  });
}



  updateProject(){
    this.projectService.updateProject(this.id,this.formProject.value as any).subscribe(
      ()=>this.router.navigate(['/project'], {
            queryParams: { message: 'Project updateted successfully' }
          })
    )

  }


   formatDate(date: string | Date): string {
  const d = new Date(date);
  const iso = d.toISOString(); // format complet avec secondes
  return iso.substring(0, 10); // extrait jusqu'à 'YYYY-MM-DDTHH:mm'
}




 // Validate startDate: must not be in the past
    validateStartDate() {
    return (control: AbstractControl): ValidationErrors | null => {
      // Ajout de cette condition :
      // Si le contrôle n'est pas "dirty" (modifié par l'utilisateur), on ne retourne pas d'erreur.
      if (!control.dirty) {
        return null;
      }

      // Le reste de votre logique existante s'exécute seulement si le champ a été modifié :
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