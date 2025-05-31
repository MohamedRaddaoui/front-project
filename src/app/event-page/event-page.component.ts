import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { EventService } from '../services/event.service';
import { Attachments, Event } from '../models/event.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    NavBarComponent,
  ],
  standalone: true,
})
export class EventPageComponent implements OnInit, OnDestroy {
  event: Event | null = null;
  userId: string | null = null;
  countdown: string = '';
  countdownValues: CountdownValues = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  private subscription: Subscription = new Subscription();
  isRegistered = false;
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.userId = this.tokenService.getUserId();

    this.subscription.add(
      this.eventService
        .getEventById(this.route.snapshot.params['id'])
        .subscribe((event) => {
          this.event = event;
          // Check if user is already registered
          this.isRegistered = this.checkIfUserRegistered();
          this.startCountdown();
        })
    );
  }

  private checkIfUserRegistered(): boolean {
    if (!this.event || !this.userId) return false;
    return (
      this.event['attendees']?.some((attendee: any) =>
        typeof attendee === 'object'
          ? attendee._id === this.userId
          : attendee === this.userId
      ) || false
    );
  }

  getStatusIcon(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'schedule'; // Clock icon for scheduled events
      case 'completed':
        return 'check_circle'; // Checkmark icon for completed events
      case 'cancelled':
        return 'cancel'; // X icon for cancelled events
      default:
        return 'help_outline'; // Question mark icon for unknown status
    }
  }

  getRemainingSpots(): number {
    if (!this.event) return 0;
    const maxAttendees = this.event['maxAttendees'] || 0;
    const currentAttendees = this.event['attendees']?.length || 0;

    // If maxAttendees is 0, it means unlimited spots
    if (maxAttendees === 0) return Infinity;

    return Math.max(0, maxAttendees - currentAttendees);
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return '#1976d2'; // Blue for scheduled
      case 'completed':
        return '#4caf50'; // Green for completed
      case 'cancelled':
        return '#f44336'; // Red for cancelled
      default:
        return '#757575'; // Grey for unknown status
    }
  }

  startCountdown() {
    if (this.event?.startTime) {
      this.subscription.add(
        interval(1000).subscribe(() => {
          const now = new Date();
          const diff =
            new Date(this.event!.startTime.toString()).getTime() -
            now.getTime();
          if (diff > 0) {
            this.countdownValues = {
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              ),
              minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((diff % (1000 * 60)) / 1000),
            };
          } else {
            this.countdown = 'Event has started!';
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getGoogleMapsLink(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
  }

  hasAvailableSpots(): boolean {
    if (!this.event) return false;
    const registered = this.event['attendees']?.length || 0;
    const max = this.event['maxAttendees'] || 0;
    return max === 0 || registered < max; // max = 0 means unlimited spots
  }

  getRegisterButtonText(): string {
    if (!this.userId) return 'Login to Register';
    if (this.event?.status === 'Completed') return 'Event Completed';
    if (this.event?.status === 'Cancelled') return 'Event Cancelled';
    if (!this.hasAvailableSpots()) return 'No Available Spots';
    return this.isRegistered ? 'Registered' : 'Register Now';
  }

  shouldShowRegisterButton(): boolean {
    return !!(
      this.userId &&
      this.event?.status === 'Scheduled' &&
      !this.isRegistered &&
      this.hasAvailableSpots()
    );
  }

  registerForEvent(): void {
    if (!this.userId) return;

    this.eventService
      .participateEvent(this.event!['_id']!, this.userId)
      // Use switchMap to get the updated event after registration
      .pipe(
        switchMap(() => this.eventService.getEventById(this.event!['_id']!))
      )
      .subscribe({
        next: (updatedEvent) => {
          this.event = updatedEvent;
          this.isRegistered = true;
          this.snackBar.open(
            'Successfully registered for the event!',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              panelClass: ['success-snackbar'],
            }
          );
        },
        error: (error) => {
          this.snackBar.open(
            error.error.message || 'Failed to register for event',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  getAttachmentIcon(mimetype: String): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video_library';
    if (mimetype.startsWith('audio/')) return 'audiotrack';
    if (mimetype.includes('pdf')) return 'picture_as_pdf';
    if (mimetype.includes('word')) return 'description';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet'))
      return 'table_chart';
    return 'insert_drive_file';
  }

  downloadAttachment(attachment: Attachments): void {
    const fileUrl = `http://localhost:5000/uploads/${attachment.filename}`;
    window.open(fileUrl, '_blank');
  }
}
