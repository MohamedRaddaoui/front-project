import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    BaseChartDirective,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalEvents: number = 0;
  totalTasks: number = 0;
  activeProjects: number = 0;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  projectChart: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Projects',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#0074B7',
        backgroundColor: 'rgba(0, 116, 183, 0.2)',
        tension: 0.4,
      },
    ],
  };

  eventChart: ChartConfiguration['data'] = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
        hoverOffset: 4,
      },
    ],
  };

  recentEvents: any[] = [];
  displayedColumns: string[] = ['title', 'date', 'status', 'actions'];

  constructor(
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.userService.getAllUsers().subscribe((users) => {
      this.totalUsers = users.length;
    });

    this.eventService.getAllEvents().subscribe((events) => {
      this.totalEvents = events.length;
      this.recentEvents = events.slice(0, 5).map((event) => ({
        ...event,
        status: this.getEventStatus(event.date.toString()),
      }));
    });

    // Simulate task and project data (replace with actual API calls)
    this.totalTasks = 45;
    this.activeProjects = 12;
  }

  private getEventStatus(date: string): string {
    const eventDate = new Date(date);
    const now = new Date();
    return eventDate < now ? 'Completed' : 'Upcoming';
  }
}
