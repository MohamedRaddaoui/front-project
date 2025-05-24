import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css']
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