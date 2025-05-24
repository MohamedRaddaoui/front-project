import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { TokenService } from '../services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  EventSettingsModel,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  DragAndDropService,
  ResizeService,
  View,
} from '@syncfusion/ej2-angular-schedule';
import { EventService } from '../services/event.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-calendar-page',
  imports: [
    ScheduleModule,
    DateTimePickerModule,
    FormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  standalone: true,
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    DragAndDropService,
    ResizeService,
  ],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
})
export class CalendarPageComponent implements OnInit {
  private jwtHelper = new JwtHelperService();
  public eventData: Event[] = [];
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public selectedDate: Date = new Date(2025, 6, 15);
  private userId: string | null = null;
  private token: string | null = null;
  // @ViewChild('editorTemplate', { static: true })
  // editorTemplate: TemplateRef<any> | undefined;

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.token = this.tokenService.getToken();
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.userId = decodedToken.userId;
    }
  }

  ngOnInit(): void {
    this.loadEvents();
    this.eventSettings = {
      dataSource: [],
    };
  }

  loadEvents(): void {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      const userId = decodedToken.userId;
      const role = decodedToken.role;

      let eventsObservable;
      if (role === 'Admin') {
        eventsObservable = this.eventService.getAllEvents();
      } else {
        eventsObservable = this.eventService.getUserEvents(userId);
      }

      eventsObservable.subscribe({
        next: (events: any[]) => {
          const mappedEvents = events.map((event) => ({
            Id: event._id,
            Subject: event.title,
            StartTime: new Date(event.startTime),
            EndTime: new Date(event.endTime),
            Location: event.location,
            Description: event.description,
            Type: event.type,
            Status: event.status,
            Visibility: event.visibility,
            createdBy: event.createdBy,
            attachments: event.attachments,
          }));

          this.eventSettings = {
            dataSource: mappedEvents,
          };
        },
        error: (err) => {
          console.error('Error fetching events:', err);
        },
      });
    }
  }

  onViewChange(args: any): void {
    if (args.requestType === 'view') {
      this.loadEvents();
    }
  }

  onActionBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      const newEvent = args.data[0];

      const eventDate = new Date(newEvent.StartTime);
      const dateOnly = eventDate.toISOString().split('T')[0];

      // Prepare the payload
      const payload = {
        title: newEvent.Subject,
        date: dateOnly,
        startTime: new Date(newEvent.StartTime).toISOString(),
        endTime: new Date(newEvent.EndTime).toISOString(),
        location: newEvent.Location,
        type: newEvent.Type || 'Meeting',
        status: newEvent.Status || 'Scheduled',
        visibility: newEvent.Visibility || 'Private',
        createdBy: this.userId || '',
        description: newEvent.Description || '',
        attachments: newEvent.attachments || [],
      };
      this.eventService.createEvent(payload).subscribe((res) => {
        console.log('Event created successfully', res);
        this.loadEvents();
      });
    }
    if (args.requestType === 'eventRemove') {
      const eventToDelete = args.data[0];

      const eventId = eventToDelete.Id;

      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          console.log('Event deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting event:', err);
        },
      });
    }
  }

  onActionComplete(args: any): void {
    if (args.requestType === 'eventChanged') {
      const updatedEvent = args.data[0];
      console.log(updatedEvent);
      const eventDate = new Date(updatedEvent.StartTime);
      const dateOnly = eventDate.toISOString().split('T')[0];

      const payload = {
        title: updatedEvent.Subject,
        date: dateOnly,
        startTime: new Date(updatedEvent.StartTime).toISOString(),
        endTime: new Date(updatedEvent.EndTime).toISOString(),
        location: updatedEvent.Location,
        description: updatedEvent.Description,
        type: updatedEvent.Type,
        visibility: updatedEvent.Visibility,
        status: updatedEvent.Status,
        createdBy: this.userId || '',
        attachements: updatedEvent.attachments || [],
      };
      this.eventService.updateEvent(updatedEvent.Id, payload).subscribe(() => {
        console.log('Event updated successfully');
      });
    }
  }

  onFileChange(event: any, data: any) {
    const file = event.target.files[0];
    if (file) {
      data.file = file;
      data.fileName = file.name;
      // You can handle file upload logic here (e.g., upload to server)
    }
  }

  onPopupOpen(args: any) {
    if (args.type === 'QuickInfo' && args.data && args.data.Subject) {
      setTimeout(() => {
        const popup = document.querySelector(
          '.e-quick-popup-wrapper .e-popup-content'
        );
        if (popup && !popup.querySelector('.custom-participate-btn')) {
          // Participate button (for all users except the owner)
          if ((args.data.createdBy._id === this.userId)) {
            const participateBtn = document.createElement('button');
            participateBtn.textContent = 'Participate';
            participateBtn.className = 'e-btn custom-participate-btn';
            participateBtn.onclick = () => this.participateInEvent(args.data);
            popup.appendChild(participateBtn);
          }
          // Only show Add Participant button if current user is the owner
          if (args.data.createdBy._id === this.userId) {
            const addParticipantBtn = document.createElement('button');
            addParticipantBtn.textContent = 'Add Participant';
            addParticipantBtn.className = 'e-btn custom-add-participant-btn';
            addParticipantBtn.onclick = () =>
              this.showAddParticipantInput(popup, args.data);
            popup.appendChild(addParticipantBtn);
          }
        }
      }, 0);
    }
  }

  // Example methods for your logic
  participateInEvent(eventData: any) {
    if (this.userId) {
      this.eventService.participateEvent(eventData.Id, this.userId!).subscribe({
        next: () => {
          this.snackBar.open(
            'You have successfully participated in the event: ' +
              eventData.Subject,
            'Close',
            { duration: 3500, panelClass: ['snackbar-success'] }
          );
          // Optionally refresh events or update UI here
        },
        error: (err) => {
          this.snackBar.open('Failed to participate in the event.', 'Close', {
            duration: 3500,
            panelClass: ['snackbar-error'],
          });
          console.error(err);
        },
      });
    } else {
      this.snackBar.open('User ID is not available.', 'Close', {
        duration: 3500,
        panelClass: ['snackbar-error'],
      });
    }
  }

  addParticipantToEvent(eventData: any) {
    // Your add participant logic here
    alert('Add participant to event: ' + eventData.Subject);
  }

  showAddParticipantInput(popup: Element, eventData: any) {
    // Remove existing input if present
    const existing = popup.querySelector('.add-participant-container');
    if (existing) existing.remove();

    // Create container
    const container = document.createElement('div');
    container.className = 'add-participant-container';
    container.style.marginTop = '12px';

    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter user emails (comma or space separated)';
    input.className = 'e-input';
    input.style.marginRight = '8px';

    // Create add button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.className = 'e-btn custom-add-btn';

    addBtn.onclick = () => {
      const emails = input.value
        .split(/[\s,]+/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      if (emails.length) {
        this.addUsersToEventByEmails(eventData.Id, emails, popup, container);
      }
    };

    container.appendChild(input);
    container.appendChild(addBtn);
    popup.appendChild(container);
  }

  addUsersToEventByEmails(
    eventId: string,
    emails: string[],
    popup: Element,
    container: Element
  ) {
    // Fetch all user IDs in parallel
    Promise.all(
      emails.map((email) =>
        this.userService
          .getUserByEmail(email)
          .toPromise()
          .catch(() => null)
      )
    ).then((users) => {
      const userIds = users.filter((u) => u && u._id).map((u) => u._id);
      console.log(userIds);
      if (userIds.length) {
        this.eventService.addParticipants(eventId, userIds).subscribe({
          next: () => {
            this.snackBar.open('Participants added!', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            container.remove();
          },
          error: (error) => {
            console.error('Error adding participants:', error);
            this.snackBar.open('Failed to add participants.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      } else {
        this.snackBar.open('No valid users found.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    });
  }
}
