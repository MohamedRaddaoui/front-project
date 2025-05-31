import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-assign-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css'] // Corrected styleUrl to styleUrls
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
  users: User[] = []; // All available users
  filteredUsers: User[] = []; // Users matching the input
  showSuggestions = false;
  isLoadingUsers = true; // Flag for loading state
  private ignoreBlur = false; // Flag to prevent blur hiding suggestions on suggestion click

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userServices: UserService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      // Use FormControl directly for easier access to valueChanges
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        // Async validators can be added here if needed, but we'll use sync + valueChanges for now
        updateOn: 'change' // Or 'blur' if preferred, but 'change' is better for autocomplete
      }),
      userType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadUsersAndSetupAutocomplete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assignedUsersList'] || changes['projectOwner']) {
      // Re-apply validators that depend on assigned users or owner
      this.updateEmailValidators();
      // Handle role disabling if owner changes
      if (this.projectOwner && this.userForm.get('userType')?.value === 'ProjectManager') {
        this.userForm.get('userType')?.setValue('');
        this.userForm.get('userType')?.markAsDirty();
      }
    }
  }

  loadUsersAndSetupAutocomplete() {
    this.isLoadingUsers = true;
    this.userServices.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoadingUsers = false;
        this.updateEmailValidators(); // Apply validators now that we have all data
        this.setupEmailAutocomplete(); // Setup autocomplete logic
        console.log("Users loaded, validators updated, autocomplete setup.");
      },
      error: (err) => {
        console.error("Failed to load users", err);
        this.isLoadingUsers = false;
        // Handle error: maybe disable the form or show a message
      }
    });
  }

  setupEmailAutocomplete() {
    this.userForm.get('email')?.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in typing
        distinctUntilChanged(), // Only emit if value changed
        tap(value => console.log('Email input changed:', value)), // Debugging tap
        // Use switchMap or map based on whether filtering is async
        // Here, filtering is synchronous against the already loaded this.users
        tap((value: string | null) => {
          if (value && value.length > 0 && !this.isLoadingUsers) {
            const filterValue = value.toLowerCase();
            this.filteredUsers = this.users.filter(user =>
              user.email.toLowerCase().includes(filterValue)
            );
            this.showSuggestions = this.filteredUsers.length > 0;
            console.log('Filtered users:', this.filteredUsers);
          } else {
            this.filteredUsers = [];
            this.showSuggestions = false;
          }
        })
      )
      .subscribe();
  }

  updateEmailValidators() {
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      // Set all validators, including those dependent on external data
      emailControl.setValidators([
        Validators.required,
        Validators.email,
        this.emailExistsValidator(this.users), // Check if the final email is in the list
        this.userIsAlreadyAssignedOrOwnerValidator(this.assignedUsersList, this.projectOwner)
      ]);
      emailControl.updateValueAndValidity({ emitEvent: false }); // Update validity without re-triggering valueChanges
      console.log("Email validators updated. Status:", emailControl.status, "Errors:", emailControl.errors);
    }
  }

  // --- VALIDATORS (mostly unchanged, ensure they use current data) ---

  userIsAlreadyAssignedOrOwnerValidator(assignedUsers: User[], owner: User | null | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedEmail = control.value;
      if (!selectedEmail || !assignedUsers || this.isLoadingUsers) return null;

      if (owner && owner.email === selectedEmail) {
        return { userIsOwner: true };
      }
      // Check assigned AFTER owner check, owner might also be in assigned list
      const alreadyAssigned = assignedUsers.some(user => user.email === selectedEmail && user.email !== owner?.email);
      if (alreadyAssigned) {
        return { userAlreadyAssigned: true };
      }
      return null;
    };
  }

  emailExistsValidator(users: User[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email || this.isLoadingUsers) {
        return null; // Don't validate if empty or users not loaded
      }
      if (!users || users.length === 0) {
          // If users array is empty after loading, the email cannot exist
          return { emailNotExists: true };
      }
      const exists = users.some(user => user.email === email);
      return exists ? null : { emailNotExists: true };
    };
  }

  // --- AUTOCOMPLETE SELECTION --- 

  selectSuggestion(user: User) {
    console.log('Suggestion selected:', user.email);
    this.ignoreBlur = true; // Prevent blur from hiding suggestions immediately
    this.userForm.get('email')?.setValue(user.email, { emitEvent: false }); // Set value without triggering valueChanges again
    this.filteredUsers = [];
    this.showSuggestions = false;
    this.userForm.get('email')?.updateValueAndValidity(); // Manually trigger validation check after selection
    console.log("Email control status after suggestion selection:", this.userForm.get('email')?.status);
    console.log("Email control errors after suggestion selection:", this.userForm.get('email')?.errors);
    // Re-focus input maybe? Optional.
    // Reset ignoreBlur flag after a short delay
    setTimeout(() => this.ignoreBlur = false, 100);
  }

  // --- FORM SUBMISSION & CLOSE --- 

  assignUser() {
    console.log("Attempting to assign user...");
    this.userForm.markAllAsTouched(); // Mark all fields as touched to show errors

    if (this.userForm.invalid) {
      console.warn("Form invalid, cannot submit:", this.userForm.value);
      console.warn("Email errors:", this.userForm.get('email')?.errors);
      console.warn("UserType errors:", this.userForm.get('userType')?.errors);
      return;
    }

    const data = {
      projectId: this.id,
      email: this.userForm.get('email')?.value,
      userType: this.userForm.get('userType')?.value
    };

    console.log("Submitting assignment data:", data);

    this.projectService.assignUserToProject(data).subscribe({
      next: (response) => {
        console.log("User assigned successfully:", response);
        this.userAssigned.emit(response);
        this.onClose();
      },
      error: (error) => {
        console.error("Error assigning user:", error);
        // TODO: Display user-friendly error message
        // Maybe set a form-level error?
        // this.userForm.setErrors({ assignmentError: 'Failed to assign user. Please try again.' });
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  // --- EVENT HANDLERS for suggestions visibility ---

  handleInputFocus() {
    // Show suggestions only if there's already some text and filtered results
    if (this.userForm.get('email')?.value && this.filteredUsers.length > 0) {
       this.showSuggestions = true;
    }
    console.log('Input focused');
  }

  handleInputBlur() {
    // Hide suggestions on blur, unless a suggestion was just clicked
    if (!this.ignoreBlur) {
        // Use timeout to allow click event on suggestion to fire first
        setTimeout(() => {
            this.showSuggestions = false;
            console.log('Suggestions hidden on blur');
        }, 150); // Adjust delay as needed
    }
  }
}

