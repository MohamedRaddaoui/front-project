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
  isDarkMode: boolean = false;

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
    
    // Charger le thème sauvegardé
    this.loadTheme();
  }

  toggleProjectDropdown(): void {
    this.isProjectDropdownOpen = !this.isProjectDropdownOpen;
  }

  toggleSettingsDropdown(): void {
    this.isSettingsDropdownOpen = !this.isSettingsDropdownOpen;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    this.saveTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.applyTheme();
    } else {
      this.isDarkMode = false;
      this.applyTheme();
    }
  }

  private saveTheme(): void {
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
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
  }}
  
