import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  role: string = '';
  isAdmin: boolean = false;
  isProjectDropdownOpen = false;
  isSettingsDropdownOpen = false;
  isRoleLoaded = false;

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.role = decoded.role;
        this.isAdmin = this.role === 'admin';
      } catch (error) {
        console.error('Token invalide :', error);
        this.role = '';
        this.isAdmin = false;
      }
    }
    this.isRoleLoaded = true;
  }

  toggleProjectDropdown(): void {
    this.isProjectDropdownOpen = !this.isProjectDropdownOpen;
  }

  toggleSettingsDropdown(): void {
    this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.has-dropdown.project')) {
      this.isProjectDropdownOpen = false;
    }
    if (!target.closest('.has-dropdown.settings')) {
      this.isSettingsDropdownOpen = false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

   isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

 
 
}
