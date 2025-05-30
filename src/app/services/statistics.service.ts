import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private baseUrl = 'http://localhost:3000/api'; // adapte à ton backend

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get(`${this.baseUrl}/stats`);
  }
}
