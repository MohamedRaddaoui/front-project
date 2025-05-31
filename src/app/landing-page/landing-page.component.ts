import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  isScrolled = false;
  contactForm!: FormGroup<any>;
  publicEvents: Event[] = [];
  currentSlide = 0;

  constructor(private eventService: EventService) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required]),
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
    this.handleScrollAnimations();
  }

  ngAfterViewInit() {
    this.handleScrollAnimations();
  }

  ngOnInit() {
    this.loadPublicEvents();
  }

  handleScrollAnimations() {
    const elements = document.querySelectorAll(
      '.animate-on-scroll, .animate-card'
    );
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        element.classList.add('visible');
      }
    });
  }
  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form submitted:', formData);
      // Here you can handle the form submission, e.g., send it to a server
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  loadPublicEvents() {
    this.eventService
      .getPublicEvents()
      .subscribe((data) => (this.publicEvents = data.events));
  }

  getVisibleCards(): number {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1200) return 2;
    return 3;
  }

  canSlideNext(): boolean {
    const visibleCards = this.getVisibleCards();
    return this.currentSlide < this.publicEvents.length - visibleCards;
  }

  canSlidePrevious(): boolean {
    return this.currentSlide > 0;
  }

  nextSlide(): void {
    if (this.canSlideNext()) {
      this.currentSlide++;
    }
  }

  previousSlide(): void {
    if (this.canSlidePrevious()) {
      this.currentSlide--;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Reset position when screen size changes to prevent empty spaces
    const maxSlide = Math.max(
      0,
      this.publicEvents.length - this.getVisibleCards()
    );
    this.currentSlide = Math.min(this.currentSlide, maxSlide);
  }
  requestDemo() {
    window.open('https://orkestra3.wordpress.com/', '_blank');
  }
}
