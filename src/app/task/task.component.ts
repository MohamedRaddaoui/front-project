import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  KanbanComponent,
  ColumnsModel,
  CardSettingsModel,
  SwimlaneSettingsModel,
  CardRenderedEventArgs,
} from '@syncfusion/ej2-angular-kanban';
import { Router } from '@angular/router';

import { addClass } from '@syncfusion/ej2-base';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { TaskKanbanMapper } from '../util/task.mapper';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TaskFilterComponent } from './task-filter/task-filter.component';
import { SBDescriptionComponent } from '../common/dp/dp.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Subject, debounceTime } from 'rxjs';
import { ViewportScroller } from '@angular/common';

interface Column {
  headerText: string;
  keyField: string;
  allowToggle: boolean;
}

@Component({
  selector: 'control-content',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    SideBarComponent,
    KanbanModule,
    DropDownListModule,
    TaskFilterComponent,
    NavBarComponent
  ]
})
export class TaskComponent implements OnInit {
  @ViewChild('kanbanObj', { static: false }) kanbanObj!: KanbanComponent;

  public kanbanData: any[] = [];
  private draggedTask: any = null;

  public columns: Column[] = [
    { headerText: 'To Do', keyField: 'Open', allowToggle: true },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
    { headerText: 'Done', keyField: 'Close', allowToggle: true },
  ];

  public cardSettings: CardSettingsModel = {
    headerField: 'Id',
    contentField: 'Summary',
    selectionType: 'Multiple',
  };

  public swimlaneSettings: SwimlaneSettingsModel = {
    keyField: 'Assignee',
  };

  tasks: any[] = [];
  users: any[] = [];
  statuses = ['To Do', 'In Progress', 'Done'];
  filteredTasks: any[] = [];
  public isLoading: boolean = false;
  public loadingTaskId: string | null = null;
  private refreshSubject = new Subject<void>();

  public visibleCards: { [key: string]: number } = {
    'Open': 3,
    'InProgress': 3,
    'Close': 3
  };

  private readonly cardIncrement = 3;
  private scrollThreshold = 0.8; // 80% of scroll height

  constructor(
    private taskService: TaskService, 
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    // Set up debounced refresh
    this.refreshSubject.pipe(
      debounceTime(300) // Wait 300ms before refreshing
    ).subscribe(() => {
      this.performRefresh();
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.users = [
      { _id: '67d99644b4e02ca9a8b0991f', firstname: 'Mohamed', lastname: 'Raddaoui' },
      { _id: '67dea703b0a765d6ff287d98', firstname: 'jean', lastname: 'philip' }
    ];
  }

  loadTasks() {
    this.refreshBoard();
  }

  mapStatus(status: string): string {
    switch (status) {
      case 'To Do':
        return 'Open';
      case 'In Progress':
        return 'InProgress';
      case 'Done':
        return 'Close';
      default:
        return 'Open';
    }
  }

  reverseMapStatus(status: string): string {
    switch (status) {
      case 'Open':
        return 'To Do';
      case 'InProgress':
        return 'In Progress';
      case 'Close':
        return 'Done';
      default:
        return 'To Do';
    }
  }

  getAssigneeName(assignee: any): string {
    return typeof assignee === 'string'
      ? assignee
      : assignee?.firstname + " " + assignee?.lastname || 'Unassigned';
  }

  getProjectid(project: any): string {
    return typeof project === 'string'
      ? project
      : project?._id || 'Unassigned';
  }

  getAssigneeId(assignee: any): string {
    return typeof assignee === 'string' ? assignee : assignee?._id || null;
  }

  getTag(tag: any): string {
    return typeof tag === 'string'
      ? tag
      : tag?.toUpperCase() || 'GENERAL';
  }

  getString(assignee: string): string {
    return assignee ? assignee.charAt(0).toUpperCase() : '';
  }

  getTagClass(tag: string): string {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('bug')) return 'tag bug';
    if (tagLower.includes('feature')) return 'tag feature';
    if (tagLower.includes('enhancement')) return 'tag enhancement';
    if (tagLower.includes('doc')) return 'tag documentation';
    if (tagLower.includes('design')) return 'tag design';
    if (tagLower.includes('test')) return 'tag testing';
    if (tagLower.includes('security')) return 'tag security';
    if (tagLower.includes('performance')) return 'tag performance';
    return 'tag';
  }

  getTagIcon(tag: string): string {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('bug')) return 'fas fa-bug';
    if (tagLower.includes('feature')) return 'fas fa-star';
    if (tagLower.includes('enhancement')) return 'fas fa-rocket';
    if (tagLower.includes('doc')) return 'fas fa-book';
    if (tagLower.includes('design')) return 'fas fa-paint-brush';
    if (tagLower.includes('test')) return 'fas fa-vial';
    if (tagLower.includes('security')) return 'fas fa-shield-alt';
    if (tagLower.includes('performance')) return 'fas fa-tachometer-alt';
    return 'fas fa-tag';
  }

  cardRendered(args: CardRenderedEventArgs): void {
    const priority = (args.data as any)?.Priority;
    if (priority) {
      addClass([args.element], priority);
    }
    console.log('Card rendered:', args.data);
  }
  OnDragStop(args: CardRenderedEventArgs): void {
    console.log('Drag stopped:', args);
  }
  onCardDrop(event: any): void {
    console.log('Card dropped:', event);
  }

  onKanbanCreated() {
    //alert('✅ Kanban prêt');
  }
  dataSourceChanged(event: any): void {
    if (event.requestType === 'cardChanged') {
      const updatedCard = event.changedRecords[0];
      const updatedTask = TaskKanbanMapper.toTaskObject(updatedCard);
      console.log('Updated task:', updatedTask);
      this.taskService.updateTask(updatedTask._id, updatedTask).subscribe({
        next: (res) => console.log('✅ Task updated', res),
        error: (err) => console.error('❌ Failed to update task', err),
        complete: () => this.ngOnInit(),
      });
    }

    // Optionnel : pour éviter que le Kanban remette les données locales à jour
    event.cancel = true;
  }
  public statusData: string[] = ['Open', 'InProgress', 'Testing', 'Close'];
  public priorityData: string[] = [
    'Low',
    'Normal',
    'Critical',
    'Release Breaker',
    'High',
  ];
  public assigneeData: string[] = [
    'Nancy Davloio',
    'Andrew Fuller',
    'Janet Leverling',
    'Steven walker',
    'Robert King',
    'Margaret hamilt',
    'Michael Suyama',
  ];
  addClick(): void {
    const url = `/task-details`;
    window.open(url, '_blank');
  }
  cardDoubleClick(args: any): void {
    const taskId = args.data?.Id;
    if (taskId) {
      const url = `/task-details/${taskId}`;
      window.open(url, '_blank');
    }
  }

  onOpen(args:any) { 
    // Preventing the modal dialog Open 
    args.cancel = true; 
  } 

  onFilterChange(filters: any) {
    this.isLoading = true;
    this.taskService.filterTasks(filters).subscribe({
      next: (response) => {
        if (!response.tasks || response.tasks.length === 0) {
          this.clearBoard();
          return;
        }

        // Update local state immediately
        this.filteredTasks = response.tasks;
        this.kanbanData = response.tasks.map((task: Task) => ({
          Id: task._id,
          Title: task.title,
          Summary: task.description,
          Tags: this.getTag(task.tags),
          Status: this.mapStatus(task.status),
          Priority: task.priority,
          Assignee: this.getAssigneeName(task.assignedUser),
          idAssigned: this.getAssigneeId(task.assignedUser),
          Type: 'story',
          ProjectId: this.getProjectid(task.projectId)
        }));

        // After data is loaded and rendered, scroll to the results
        setTimeout(() => {
          const kanbanBoard = document.querySelector('.kanban-board');
          if (kanbanBoard) {
            kanbanBoard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error filtering tasks:', error);
        this.clearBoard();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getTasksByColumnStatus(status: string): any[] {
    if (!this.kanbanData || this.kanbanData.length === 0) {
      return [];
    }
    const tasks = this.kanbanData.filter(task => task.Status === status);
    return tasks.slice(0, this.visibleCards[status]);
  }

  hasMoreTasks(status: string): boolean {
    if (!this.kanbanData) return false;
    const totalTasks = this.kanbanData.filter(task => task.Status === status).length;
    return totalTasks > this.visibleCards[status];
  }

  loadMoreTasks(status: string): void {
    this.visibleCards[status] += this.cardIncrement;
  }

  onColumnScroll(event: Event, status: string): void {
    const element = event.target as HTMLElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    if (scrollPosition / scrollHeight > this.scrollThreshold) {
      this.loadMoreTasks(status);
    }
  }

  getRemainingTaskCount(status: string): number {
    if (!this.kanbanData) return 0;
    const totalTasks = this.kanbanData.filter(task => task.Status === status).length;
    return Math.max(0, totalTasks - this.visibleCards[status]);
  }

  onDragStart(event: DragEvent, task: any) {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.Id);
    }
    const element = event.target as HTMLElement;
    element.classList.add('dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('drag-over');
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.classList.remove('drag-over');

    if (this.draggedTask && this.draggedTask.Status !== newStatus) {
      this.loadingTaskId = this.draggedTask.Id;

      const updatedTask = {
        ...this.draggedTask,
        status: this.reverseMapStatus(newStatus)
      };

      // Store the original status in case of error
      const originalStatus = this.draggedTask.Status;

      // Update local state immediately for better UX
      const taskIndex = this.kanbanData.findIndex(t => t.Id === updatedTask.Id);
      if (taskIndex !== -1) {
        this.kanbanData[taskIndex] = {
          ...this.kanbanData[taskIndex],
          Status: newStatus
        };
      }

      this.taskService.updateTask(updatedTask.Id, updatedTask).subscribe({
        next: () => {
          // Only trigger a refresh if needed
          this.refreshSubject.next();
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          if (error.status === 404) {
            this.clearBoard();
          } else {
            // Revert the task to its original status only if not 404
            if (taskIndex !== -1) {
              this.kanbanData[taskIndex] = {
                ...this.kanbanData[taskIndex],
                Status: originalStatus
              };
            }
          }
        },
        complete: () => {
          this.loadingTaskId = null;
          this.draggedTask = null;
        }
      });
    }

    this.draggedTask = null;
  }

  refreshBoard() {
    this.refreshSubject.next();
  }

  private performRefresh() {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        const mappedTasks = tasks.map((task: Task) => ({
          Id: task._id,
          Title: task.title,
          Summary: task.description,
          Tags: this.getTag(task.tags),
          Status: this.mapStatus(task.status),
          Priority: task.priority,
          Assignee: this.getAssigneeName(task.assignedUser),
          idAssigned: this.getAssigneeId(task.assignedUser),
          Type: 'story',
          ProjectId: this.getProjectid(task.projectId)
        }));

        // Update the data sources
        this.tasks = tasks;
        this.kanbanData = mappedTasks;
        this.filteredTasks = [...tasks];
      },
      error: (error) => {
        console.error('Error refreshing board:', error);
        // Clear all data if we get a 404
        if (error.status === 404) {
          this.tasks = [];
          this.kanbanData = [];
          this.filteredTasks = [];
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getUserInitials(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    }
    return '??';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Open':
        return 'fas fa-list-ul text-primary';
      case 'InProgress':
        return 'fas fa-spinner text-warning';
      case 'Close':
        return 'fas fa-check-circle text-success';
      default:
        return 'fas fa-list';
    }
  }

  private clearBoard() {
    this.filteredTasks = [];
    this.kanbanData = [];
    this.isLoading = false;
  }

  getTaskCountByStatus(status: string): number {
    if (!this.kanbanData) return 0;
    return this.kanbanData.filter(task => task.Status === status).length;
  }
}
