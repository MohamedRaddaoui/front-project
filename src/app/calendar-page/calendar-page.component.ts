import { Component, OnInit } from '@angular/core';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';

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

@Component({
  selector: 'app-root',
  imports: [ScheduleModule],
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
  public eventData: Event[] = [];
  public eventSettings: EventSettingsModel = { dataSource: [] };
  public selectedDate: Date = new Date(2025, 6, 15);

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
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
        createdBy: '67d99644b4e02ca9a8b0991f',
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
        createdBy: '67d99644b4e02ca9a8b0991f',
      };

      this.eventService.updateEvent(updatedEvent.Id, payload).subscribe(() => {
        console.log('Event updated successfully');
      });
    }
  }
}
