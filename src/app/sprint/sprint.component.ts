import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Sprint } from '../models/sprint.model';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';

// *** VALIDATEUR PERSONNALISÉ pour vérifier que endTime > startTime ***
export function timeRangeValidator(startTimeKey: string, endTimeKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startTime = group.get(startTimeKey)?.value;
    const endTime = group.get(endTimeKey)?.value;
    if (!startTime || !endTime) {
      return null;
    }
    if (endTime <= startTime) {
      const errors = group.get(endTimeKey)?.errors || {};
      errors['endTimeNotAfterStart'] = true;
      group.get(endTimeKey)?.setErrors(errors);
      return { endTimeNotAfterStart: true };
    } else {
      const errors = group.get(endTimeKey)?.errors;
      if (errors && errors['endTimeNotAfterStart']) {
        delete errors['endTimeNotAfterStart'];
        if (Object.keys(errors).length === 0) {
            group.get(endTimeKey)?.setErrors(null);
        } else {
            group.get(endTimeKey)?.setErrors(errors);
        }
      }
    }
    return null;
  };
}

// *** VALIDATEUR PERSONNALISÉ pour vérifier qu'une date n'est pas dans le passé ***
export function noPastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Ne pas valider si vide (géré par required)
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Mettre l'heure à minuit pour comparer uniquement les dates
    const controlDate = new Date(control.value);
    controlDate.setHours(0, 0, 0, 0);

    if (controlDate < today) {
      return { dateInPast: true };
    }
    return null;
  };
}

// *** VALIDATEUR PERSONNALISÉ pour vérifier que end_date > start_date ***
export function dateRangeValidator(startDateKey: string, endDateKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get(startDateKey)?.value;
    const endDate = group.get(endDateKey)?.value;

    if (!startDate || !endDate) {
      return null; // Ne pas valider si les champs ne sont pas remplis
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(0, 0, 0, 0);

    if (endDateObj <= startDateObj) {
      // Appliquer l'erreur sur le contrôle end_date
      const errors = group.get(endDateKey)?.errors || {};
      errors['endDateNotAfterStartDate'] = true;
      group.get(endDateKey)?.setErrors(errors);
      return { endDateNotAfterStartDate: true }; // Erreur sur le groupe pour référence
    } else {
      // Si valide, s'assurer de supprimer l'erreur potentielle
      const errors = group.get(endDateKey)?.errors;
      if (errors && errors['endDateNotAfterStartDate']) {
        delete errors['endDateNotAfterStartDate'];
        if (Object.keys(errors).length === 0) {
            group.get(endDateKey)?.setErrors(null);
        } else {
            group.get(endDateKey)?.setErrors(errors);
        }
      }
    }
    return null;
  };
}

// *** VALIDATEUR PERSONNALISÉ pour vérifier qu'une date est >= start_date ***
export function dateAfterStartDateValidator(startDateKey: string, dateToCheckKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get(startDateKey)?.value;
    const dateToCheck = group.get(dateToCheckKey)?.value;

    if (!startDate || !dateToCheck) {
      return null; // Ne pas valider si les champs ne sont pas remplis
    }

    const startDateObj = new Date(startDate);
    const dateToCheckObj = new Date(dateToCheck);
    startDateObj.setHours(0, 0, 0, 0);
    dateToCheckObj.setHours(0, 0, 0, 0);

    if (dateToCheckObj < startDateObj) {
      // Appliquer l'erreur sur le contrôle dateToCheckKey
      const errors = group.get(dateToCheckKey)?.errors || {};
      errors['dateNotAfterStartDate'] = true;
      group.get(dateToCheckKey)?.setErrors(errors);
      return { dateNotAfterStartDate: { field: dateToCheckKey } }; // Erreur sur le groupe
    } else {
      // Si valide, s'assurer de supprimer l'erreur potentielle
      const errors = group.get(dateToCheckKey)?.errors;
      if (errors && errors['dateNotAfterStartDate']) {
        delete errors['dateNotAfterStartDate'];
        if (Object.keys(errors).length === 0) {
            group.get(dateToCheckKey)?.setErrors(null);
        } else {
            group.get(dateToCheckKey)?.setErrors(errors);
        }
      }
    }
    return null;
  };
}


@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {
  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) {}

  @Input() visible = false;
  @Input() projectId: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() sprintAdded = new EventEmitter<Sprint>();

  closeModal() {
    this.close.emit();
  }

  formSprint = new FormGroup({
    title: new FormControl('', Validators.required),
    goal: new FormControl(''),
    // Ajout du validateur noPastDateValidator pour start_date
    start_date: new FormControl('', [Validators.required, noPastDateValidator()]),
    // end_date est validé par le validateur de groupe dateRangeValidator
    end_date: new FormControl('', Validators.required),
    status: new FormControl('Planned'),
    projectID: new FormControl(''),
    // Dates des réunions avec validation noPastDateValidator
    planning: new FormControl('', noPastDateValidator()), // Daily date
    reviews: new FormControl('', noPastDateValidator()), // Review date
    retrospectives: new FormControl('', noPastDateValidator()), // Retro date
    // Heures requises
    dailyStartTime: new FormControl('', Validators.required),
    dailyEndTime: new FormControl('', Validators.required),
    reviewStartTime: new FormControl('', Validators.required),
    reviewEndTime: new FormControl('', Validators.required),
    retroStartTime: new FormControl('', Validators.required),
    retroEndTime: new FormControl('', Validators.required),
  }, {
    // *** AJOUT DES VALIDATEURS PERSONNALISÉS au niveau du groupe ***
    validators: [
      timeRangeValidator('dailyStartTime', 'dailyEndTime'),
      timeRangeValidator('reviewStartTime', 'reviewEndTime'),
      timeRangeValidator('retroStartTime', 'retroEndTime'),
      dateRangeValidator('start_date', 'end_date'), // Valide start_date < end_date
      // Valide que les dates des réunions sont >= start_date
      dateAfterStartDateValidator('start_date', 'planning'),
      dateAfterStartDateValidator('start_date', 'reviews'),
      dateAfterStartDateValidator('start_date', 'retrospectives')
    ]
  });

  ngOnInit() {
    if (this.projectId) {
      this.formSprint.patchValue({ projectID: this.projectId });
    } else {
      const routeProjectId = this.route.snapshot.paramMap.get('id');
      if (routeProjectId) {
        this.projectId = routeProjectId;
        this.formSprint.patchValue({ projectID: this.projectId });
      } else {
        console.error("SprintComponent: Project ID non fourni via @Input ni trouvé dans la route.");
      }
    }
  }

  addSprint() {
    if (!this.formSprint.value.projectID) {
        console.error("Tentative d'ajout de sprint sans projectID défini.");
        return;
    }

    if (this.formSprint.valid) {
      console.log("[DEBUG] Tentative d'ajout de sprint avec les données:", this.formSprint.value);
      const sprintDataForBackend: Sprint = {
        title: this.formSprint.value.title ?? '',
        goal: this.formSprint.value.goal ?? '',
        start_date: this.formSprint.value.start_date ?? '',
        end_date: this.formSprint.value.end_date ?? '',
        // Inclure les dates des réunions si elles existent
        // planning: this.formSprint.value.planning ?? undefined,
        // reviews: this.formSprint.value.reviews ?? undefined,
        // retrospectives: this.formSprint.value.retrospectives ?? undefined,
        // Heures
        dailyStartTime: this.formSprint.value.dailyStartTime ?? '',
        dailyEndTime: this.formSprint.value.dailyEndTime ?? '',
        reviewStartTime: this.formSprint.value.reviewStartTime ?? '',
        reviewEndTime: this.formSprint.value.reviewEndTime ?? '',
        retroStartTime: this.formSprint.value.retroStartTime ?? '',
        retroEndTime: this.formSprint.value.retroEndTime ?? ''
      };

      this.projectService.createSprint(this.projectId, sprintDataForBackend)
        .subscribe({
          next: (response) => {
            console.log('Sprint créé avec succès:', response);
            // Assurez-vous que la réponse correspond à la structure attendue
            // Si la réponse est un tableau, prenez le premier élément
            const createdSprint = Array.isArray(response) ? response[0] : response;
            this.sprintAdded.emit(createdSprint);
            this.close.emit();
             const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
          },
          error: (error) => {
            console.error("Erreur lors de la création du sprint:", error);
            // Afficher un message d'erreur à l'utilisateur ?
          }
        });
    } else {
        console.warn("Le formulaire de sprint n'est pas valide. Vérifiez les erreurs.");
        this.formSprint.markAllAsTouched(); // Marquer tous les champs pour afficher les erreurs
    }
  }

  // Fonctions utilitaires pour accéder aux contrôles dans le template
  get title() { return this.formSprint.get('title'); }
  get startDate() { return this.formSprint.get('start_date'); }
  get endDate() { return this.formSprint.get('end_date'); }
  get planningDate() { return this.formSprint.get('planning'); }
  get reviewsDate() { return this.formSprint.get('reviews'); }
  get retrospectivesDate() { return this.formSprint.get('retrospectives'); }
  get dailyStartTime() { return this.formSprint.get('dailyStartTime'); }
  get dailyEndTime() { return this.formSprint.get('dailyEndTime'); }
  get reviewStartTime() { return this.formSprint.get('reviewStartTime'); }
  get reviewEndTime() { return this.formSprint.get('reviewEndTime'); }
  get retroStartTime() { return this.formSprint.get('retroStartTime'); }
  get retroEndTime() { return this.formSprint.get('retroEndTime'); }
}

