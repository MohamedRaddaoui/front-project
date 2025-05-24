import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../services/event.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import {
  AccumulationChartModule,
  AccumulationLegendService,
  AccumulationTooltipService,
  AccumulationDataLabelService,
  PieSeriesService,
} from '@syncfusion/ej2-angular-charts';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-eventdashboard',
  standalone: true,
  imports: [
    CommonModule,
    AccumulationChartModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    DatePipe,
  ],
  templateUrl: './eventdashboard.component.html',
  styleUrls: ['./eventdashboard.component.css'],
  providers: [
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
  ],
})
export class EventdashboardComponent implements OnInit {
  events: any[] = [];
  kpis = {
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  };
  statusChartData: any[] = [];
  typeChartData: any[] = [];

  // Pie chart configs
  public statusPieLegend = { visible: true, position: 'Bottom' };
  public statusPieTooltip = {
    enable: true,
    format: '${point.x}: <b>${point.y}</b>',
  };
  public typePieLegend = { visible: true, position: 'Bottom' };
  public typePieTooltip = {
    enable: true,
    format: '${point.x}: <b>${point.y}</b>',
  };

  // Table
  displayedColumns: string[] = [
    'title',
    'type',
    'status',
    'startTime',
    'endTime',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;
      this.kpis.total = events.length;
      this.kpis.scheduled = events.filter(
        (e) => e.status === 'Scheduled'
      ).length;
      this.kpis.completed = events.filter(
        (e) => e.status === 'Completed'
      ).length;
      this.kpis.cancelled = events.filter(
        (e) => e.status === 'Cancelled'
      ).length;

      // Pie chart for status
      this.statusChartData = [
        { x: 'Scheduled', y: this.kpis.scheduled },
        { x: 'Completed', y: this.kpis.completed },
        { x: 'Cancelled', y: this.kpis.cancelled },
      ];

      // Pie chart for event types
      const typeMap: Record<string, number> = {};
      events.forEach((e) => {
        typeMap[e.type as string] = (typeMap[e.type as string] || 0) + 1;
      });
      this.typeChartData = Object.entries(typeMap).map(([type, count]) => ({
        x: type,
        y: count,
      }));

      // Table data
      this.dataSource = new MatTableDataSource(events);
      setTimeout(() => {
        if (this.paginator) this.dataSource.paginator = this.paginator;
      });
    });
  }

  addEvent() {
    throw new Error('Method not implemented.');
  }

  updateEvent(event: any) {
    // You can implement a dialog here or navigate to edit page
    console.log('Editing event:', event);
    this.snackBar.open('Edit feature coming soon!', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
    });
  }

  deleteEvent(event: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
          });
          // Refresh the data
          this.loadEvents();
        },
        error: (error) => {
          this.snackBar.open('Error deleting event', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
          });
        },
      });
    }
  }
}
