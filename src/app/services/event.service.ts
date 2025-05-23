import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/env';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.baseUrl}/events`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(isFormData = false): HttpHeaders {
    const token = this.tokenService.getToken();
    const headersConfig: any = {
      Authorization: `Bearer ${token}`,
    };
    if (!isFormData) {
      headersConfig['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headersConfig);
  }

  // Create a new event with optional attachments
  createEvent(eventData: Event): Observable<any> {
    const formData = new FormData();
    for (const key in eventData) {
      if (key === 'attachments' && Array.isArray(eventData[key])) {
        eventData[key].forEach((file: File) =>
          formData.append('attachments', file)
        );
      } else {
        formData.append(key, eventData[key]);
      }
    }

    return this.http.post(`${this.apiUrl}/`, formData, {
      headers: this.getAuthHeaders(true),
    });
  }

  // Get all events
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get event by ID
  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/getEventById/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get events by user ID
  getUserEvents(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update an event (supports attachments)
  updateEvent(id: string, updatedData: Event): Observable<any> {
    const formData = new FormData();
    for (const key in updatedData) {
      if (key === 'attachments' && Array.isArray(updatedData[key])) {
        updatedData[key].forEach((file: File) =>
          formData.append('attachments', file)
        );
      } else {
        formData.append(key, updatedData[key]);
      }
    }
    return this.http.patch(`${this.apiUrl}/updateEventById/${id}`, formData, {
      headers: this.getAuthHeaders(true),
    });
  }

  // Delete an event
  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteEventById/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Participate in an event
  participateEvent(eventId: string, userId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/participate`,
      { userId },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Cancel participation
  cancelParticipation(eventId: string, userId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${eventId}/cancel`,
      { userId },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  //Chat with AI Assistant
  chatWithAI(prompt: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/chatbot`,
      { prompt: prompt },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Add participants to an event
  addParticipants(eventId: string, userIds: string[]): Observable<any> {
    console.log('Adding participants:', userIds);
    console.log('Event ID:', eventId);
    return this.http.post(
      `${this.apiUrl}/${eventId}/add-participants`,
      { userIds },
      { headers: this.getAuthHeaders() }
    );
  }
}
