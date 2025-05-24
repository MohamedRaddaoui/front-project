import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assign-user.component.html',
  styleUrl: './assign-user.component.css'
})
export class AssignUserComponent implements OnInit {

  @Input() position!: { top: string; left: string };
  @Output() close = new EventEmitter<void>();

  userForm: FormGroup;
  roles = ['Manager', 'User'];
  id!: string;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required] // Change ici de 'role' à 'userType' pour correspondre à ce que ton backend attend
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  assignUser() {
    if (this.userForm.invalid) {
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
        console.log("User assigned", response);
        this.close.emit();
      },
      error: (error) => {
        console.error("Erreur lors de l'attribution :", error);
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
