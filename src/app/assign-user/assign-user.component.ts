import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-user',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './assign-user.component.html',
  styleUrl: './assign-user.component.css'
})
export class AssignUserComponent {

  @Input() position!: { top: string; left: string };
  @Output() close = new EventEmitter<void>();

  userForm: FormGroup;

  roles = ['Manager', 'User'];

  constructor(private fb: FormBuilder,private projectService :ProjectService,private route:ActivatedRoute) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('User data:', this.userForm.value);
      this.close.emit(); // Ferme la popup après soumission
    }
  }

  onClose() {
    this.close.emit();
  }
id!: string;
formUser=new FormGroup({
  email: new FormControl(),
  projectID: new FormControl(),
  userType: new FormControl()
})

ngOnInit() {
  this.id = this.route.snapshot.paramMap.get('id')!;
  this.formUser.patchValue({ projectID: this.id });
}
  
   
assignUser() {
  this.formUser.patchValue({ projectID: this.id });

  this.projectService.createBacklog(this.id, this.formUser.value)
    .subscribe(response => {
      console.log('User added', response);
    });
}

  


}
