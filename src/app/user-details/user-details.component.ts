import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: string;
  userPhoto: string = '';
  
  // Etat pour savoir si on est en mode édition par champ
  isEditing: any = {
    firstname: false,
    lastname: false,
    email: false,
    role: false,
    photo: false
  };

  private jwtHelper = new JwtHelperService();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.userId = decoded.userId;

      this.userService.getUserById(this.userId).subscribe(user => {
        this.profileForm = this.fb.group({
          firstname: [{value: user.firstname, disabled: true}, Validators.required],
          lastname: [{value: user.lastname, disabled: true}, Validators.required],
          email: [{value: user.email, disabled: true}, [Validators.required, Validators.email]],
          role: [{value: user.role, disabled: true}, Validators.required],
          photo: [null]
        });
        this.userPhoto = user.photo;
      });
    }
  }

  enableEdit(field: string) {
    this.profileForm.get(field)?.enable();
    this.isEditing[field] = true;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({ photo: file });
      this.isEditing.photo = true;
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const formData = new FormData();

    // On n'envoie que les champs édités
    Object.keys(this.isEditing).forEach(field => {
      if (this.isEditing[field]) {
        if (field === 'photo' && this.profileForm.value.photo) {
          formData.append('photo', this.profileForm.value.photo);
        } else if (field !== 'photo') {
          formData.append(field, this.profileForm.get(field)?.value);
        }
      }
    });

    this.userService.updateUser(this.userId, formData).subscribe(() => {
      alert('Profil mis à jour avec succès !');

      // Désactivation des champs après sauvegarde
      Object.keys(this.isEditing).forEach(field => {
        if (this.isEditing[field] && field !== 'photo') {
          this.profileForm.get(field)?.disable();
          this.isEditing[field] = false;
        }
      });

      // Recharger la photo si modifiée
      if (this.isEditing.photo) {
        this.userPhoto = this.profileForm.get('photo')?.value;
        this.isEditing.photo = false;
      }
    });
  }
}
