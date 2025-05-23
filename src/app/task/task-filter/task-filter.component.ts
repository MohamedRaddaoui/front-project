import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-panel" [class.expanded]="isExpanded">
      <button class="filter-toggle" (click)="togglePanel()">
        <i class="fas fa-filter"></i>
        {{ isExpanded ? 'Hide Filters' : 'Show Filters' }}
      </button>
      
      <div class="filter-content" *ngIf="isExpanded">
        <div class="filter-section">
          <h3>Filters</h3>
          <div class="filter-grid">
            <!-- Assigned User Filter -->
            <div class="filter-item">
              <label>Assigned To</label>
              <select [(ngModel)]="filters.assignedUser" (change)="applyFilters()">
                <option value="">All Users</option>
                <option *ngFor="let user of users" [value]="user._id">
                  {{user.firstname}} {{user.lastname}}
                </option>
              </select>
            </div>

            <!-- Status Filter -->
            <div class="filter-item">
              <label>Status</label>
              <select [(ngModel)]="filters.status" (change)="applyFilters()">
                <option value="">All Status</option>
                <option *ngFor="let status of statuses" [value]="status">
                  {{status}}
                </option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div class="filter-item">
              <label>Priority</label>
              <select [(ngModel)]="filters.priority" (change)="applyFilters()">
                <option value="">All Priorities</option>
                <option *ngFor="let priority of priorities" [value]="priority">
                  {{priority}}
                </option>
              </select>
            </div>

            <!-- Due Date Filter -->
            <div class="filter-item">
              <label>Due Before</label>
              <input 
                type="date" 
                [(ngModel)]="filters.dueDate" 
                (change)="applyFilters()"
              >
            </div>

            <!-- Inappropriate Comments Filter -->
            <div class="filter-item checkbox">
              <label>
                <input 
                  type="checkbox" 
                  [(ngModel)]="filters.inappropriateComments"
                  (change)="applyFilters()"
                >
                Show Flagged Comments Only
              </label>
            </div>
          </div>

          <div class="filter-actions">
            <button class="clear-btn" (click)="clearFilters()">
              <i class="fas fa-times"></i> Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      overflow: hidden;
    }

    .filter-toggle {
      width: 100%;
      padding: 12px;
      background: #f4f5f7;
      border: none;
      text-align: left;
      font-weight: 500;
      color: #42526e;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background-color 0.2s;
    }

    .filter-toggle:hover {
      background: #ebecf0;
    }

    .filter-content {
      padding: 16px;
    }

    .filter-section h3 {
      margin: 0 0 16px;
      color: #172b4d;
      font-size: 14px;
      font-weight: 600;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-item label {
      font-size: 12px;
      font-weight: 500;
      color: #5e6c84;
    }

    .filter-item select,
    .filter-item input[type="date"] {
      padding: 8px;
      border: 1px solid #dfe1e6;
      border-radius: 3px;
      font-size: 14px;
      color: #172b4d;
      background: white;
    }

    .filter-item.checkbox {
      flex-direction: row;
      align-items: center;
    }

    .filter-item.checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid #dfe1e6;
    }

    .clear-btn {
      padding: 6px 12px;
      background: none;
      border: 1px solid #dfe1e6;
      border-radius: 3px;
      color: #42526e;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: #f4f5f7;
      border-color: #c1c7d0;
    }
  `]
})
export class TaskFilterComponent {
  @Input() users: any[] = [];
  @Input() statuses: string[] = ['To Do', 'In Progress', 'Done'];
  @Input() priorities: string[] = ['Low', 'Medium', 'High'];
  @Output() filterChange = new EventEmitter<any>();

  isExpanded = false;
  filters = {
    assignedUser: '',
    status: '',
    priority: '',
    dueDate: null as Date | null,
    inappropriateComments: false
  };

  togglePanel() {
    this.isExpanded = !this.isExpanded;
  }

  applyFilters() {
    this.filterChange.emit(this.filters);
  }

  clearFilters() {
    this.filters = {
      assignedUser: '',
      status: '',
      priority: '',
      dueDate: null,
      inappropriateComments: false
    };
    this.applyFilters();
  }
} 