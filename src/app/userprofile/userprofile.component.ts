import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

@Component({
  selector: 'user-profile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserProfileComponent implements OnInit {
  isEditMode = false;
  userData: UserData = {
    firstName: 'Yash',
    lastName: 'Ghori',
    email: 'yghori@asite.com',
    profileImage:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/f486d7dc5b79ce64c0ca97581ff142e997bb02af?placeholderIfAbsent=true&apiKey=6cd8224d56d844fb8789e8857a0e03e8',
  };

  originalUserData: UserData = { ...this.userData };

  ngOnInit(): void {
    // Initialize component
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      // Store original data in case user cancels
      this.originalUserData = { ...this.userData };
    }
    this.isEditMode = !this.isEditMode;
  }

  updateUser(): void {
    // Here you would typically call a service to update the user data
    console.log('Updating user with data:', this.userData);

    // Simulate API call success
    setTimeout(() => {
      console.log('User updated successfully');
      // You could show a success message here
    }, 500);
  }

  cancelEdit(): void {
    // Restore original data
    this.userData = { ...this.originalUserData };
    this.isEditMode = false;
  }

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check if file is an image
      if (!file.type.match('image.*')) {
        console.error('Please select an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File size should not exceed 5MB');
        return;
      }

      // Create a FileReader to read the image
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // Update the profile image in userData
        this.userData.profileImage = e.target.result;
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  }
}
