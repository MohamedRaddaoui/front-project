import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-assign-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './assign-user.component.html',
  styleUrl: './assign-user.component.css'
})
export class AssignUserComponent implements OnInit, OnChanges {

  @Input() position!: { top: string; left: string };
  @Output() close = new EventEmitter<void>();
  @Output() userAssigned = new EventEmitter<any>();
  @Input() assignedUsersList: User[] = [];
  @Input() projectOwner: User | null | undefined = null;

  userForm: FormGroup;
  roles = ['ProjectManager', 'User'];
  id!: string;
  users: User[] = []; // Initialiser ici

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService, private userServices: UserService,
    private route: ActivatedRoute
  ) {
    // --- MODIFICATION 1: Initialiser avec les validateurs de base uniquement ---
    this.userForm = this.fb.group({
      // Seuls les validateurs qui ne dépendent PAS de données externes ici
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.userServices.getAllUsers().subscribe({
      next: (data) => {
        console.log("Users loaded:", data); // Log pour confirmer
        this.users = data;
        // --- MODIFICATION 2: Appeler la mise à jour des validateurs APRES le chargement des users ---
        this.updateEmailValidators();
      },
      error: (err) => {
        console.error("Failed to load users", err);
        // Envisager de désactiver le champ email ou d'afficher un message d'erreur à l'utilisateur
      }
    });
    // Ne PAS ajouter de validateurs dépendant de this.users ici
  }

  ngOnChanges(changes: SimpleChanges) {
    // --- MODIFICATION 3: S'assurer que updateEmailValidators est appelé quand les Inputs changent ---
    // (Votre code le faisait déjà correctement, juste une confirmation)
    if (changes['assignedUsersList'] || changes['projectOwner']) {
      this.updateEmailValidators();
      // Gérer la désactivation du rôle PM si nécessaire (votre code le fait déjà)
      if (this.projectOwner && this.userForm.get('userType')?.value === 'ProjectManager') {
        this.userForm.get('userType')?.setValue('');
        this.userForm.get('userType')?.markAsDirty();
      }
    }
  }

  // --- MODIFICATION 4: La fonction qui met à jour les validateurs (pas de changement majeur, mais centrale) ---
  updateEmailValidators() {
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      console.log("Updating email validators with users:", this.users, "assigned:", this.assignedUsersList, "owner:", this.projectOwner); // Log de débogage

      // Définit TOUS les validateurs nécessaires pour l'email, y compris ceux dépendant des données
      emailControl.setValidators([
        Validators.required,
        Validators.email,
        // Ces validateurs utiliseront maintenant les données à jour (this.users, this.assignedUsersList, this.projectOwner)
        this.emailExistsValidator(this.users),
        this.userIsAlreadyAssignedOrOwnerValidator(this.assignedUsersList, this.projectOwner)
      ]);

      // Très important : déclencher la réévaluation après avoir changé les validateurs
      emailControl.updateValueAndValidity();
      console.log("Email control status after update:", emailControl.status);
      console.log("Email control errors after update:", emailControl.errors);
    }
  }

  // Validateur pour vérifier si l'utilisateur est déjà assigné ou propriétaire
  userIsAlreadyAssignedOrOwnerValidator(assignedUsers: User[], owner: User | null | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedEmail = control.value;
      if (!selectedEmail || !assignedUsers) return null; // Vérifier aussi assignedUsers

      const alreadyAssigned = assignedUsers.some(user => user.email === selectedEmail);
      if (alreadyAssigned) {
        return { userAlreadyAssigned: true };
      }
      if (owner && owner.email === selectedEmail) {
        return { userIsOwner: true };
      }
      return null;
    };
  }

  // Validateur pour vérifier si l'email existe dans la liste globale
  emailExistsValidator(users: User[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      // console.log('Validating email:', email, 'against users:', users); // Garder pour debug si besoin
      if (!email) {
        return null; // Ne pas valider si le champ est vide (géré par required)
      }
      // Important : Gérer le cas où la liste users n'est pas encore chargée
      if (!users || users.length === 0) {
        // console.log('User list is empty or not yet loaded for emailExists validation');
        // Si la liste n'est pas chargée, on ne peut pas dire que l'email n'existe pas.
        // On pourrait retourner null, mais cela pourrait masquer un problème de chargement.
        // Retourner une erreur spécifique ou simplement ne rien faire (laisser required faire son travail)
        // Ici, on considère que si la liste est vide, l'email ne peut pas exister dedans.
        // MAIS, cela pose problème si le validateur est appelé AVANT la fin du chargement.
        // La stratégie d'ajouter le validateur APRES le chargement résout ce problème.
        return { emailNotExists: true }; // Cette ligne ne devrait plus poser problème avec la nouvelle stratégie
      }
      const exists = users.some(user => user.email === email);
      // console.log('Email exists in list:', exists);
      return exists ? null : { emailNotExists: true };
    };
  }

  assignUser() {
    console.log("assignUser called");

    if (this.userForm.invalid) {
      console.warn("Form invalid, cannot submit:", this.userForm.value);
      console.warn("Email errors:", this.userForm.get('email')?.errors);
      console.warn("UserType errors:", this.userForm.get('userType')?.errors);
      // Forcer l'affichage des erreurs si l'utilisateur clique sur un bouton désactivé (optionnel)
      this.userForm.markAllAsTouched();
      return;
    }

    const data = {
      projectId: this.id,
      email: this.userForm.get('email')?.value,
      userType: this.userForm.get('userType')?.value
    };

    console.log("Données envoyées :", data);

    this.projectService.assignUserToProject(data).subscribe({
      next: (response) => {
        console.log("User assigned successfully:", response);
        this.userAssigned.emit(response);
        this.onClose(); // Fermer après succès
      },
      error: (error) => {
        console.error("Erreur lors de l'attribution de l'utilisateur:", error);
        // Afficher un message d'erreur à l'utilisateur serait une bonne pratique
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}

