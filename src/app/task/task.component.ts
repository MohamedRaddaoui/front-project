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
import { SBActionDescriptionComponent } from '../common/adp/adp.component';

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
    SBDescriptionComponent,
    SBActionDescriptionComponent,
    SideBarComponent,
    KanbanModule,
    DropDownListModule,
    TaskFilterComponent
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

  constructor(private taskService: TaskService, private router: Router) { 
    

  }

  ngOnInit(): void {
    this.loadTasks();
    this.users = [
      { _id: '67d99644b4e02ca9a8b0991f', firstname: 'Mohamed', lastname: 'Raddaoui' },
      { _id: '67dea703b0a765d6ff287d98', firstname: 'jean', lastname: 'philip' }
    ];
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe((tasks: Task[]) => {
      this.kanbanData = tasks.map((task: Task) => ({
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
      this.tasks = tasks;
      this.filteredTasks = [...tasks];
    });
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
    return (
      assignee
        .match(/\b(\w)/g)
        ?.join('')
        .toUpperCase() || ''
    );
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
    this.taskService.filterTasks(filters).subscribe({
      next: (response) => {
        this.filteredTasks = response.tasks;
        this.kanbanData = this.filteredTasks.map((task: Task) => ({
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
      },
      error: (error) => {
        console.error('Error filtering tasks:', error);
      }
    });
  }

  getTasksByColumnStatus(status: string): any[] {
    return this.kanbanData.filter(task => task.Status === status);
  }

  getTaskCountByStatus(status: string): number {
    return this.getTasksByColumnStatus(status).length;
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
      const updatedTask = {
        ...this.draggedTask,
        status: this.reverseMapStatus(newStatus)
      };

      this.taskService.updateTask(updatedTask.Id, updatedTask).subscribe({
        next: () => {
          this.draggedTask.Status = newStatus;
          this.loadTasks(); // Refresh the board
        },
        error: (error) => {
          console.error('Error updating task status:', error);
        }
      });
    }

    this.draggedTask = null;
  }

  getUserInitials(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    }
    return '??';
  }
}
