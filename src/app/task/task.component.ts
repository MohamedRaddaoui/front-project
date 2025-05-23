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

@Component({
  selector: 'control-content',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SideBarComponent, KanbanModule],
})
export class TaskComponent implements OnInit {
  @ViewChild('kanbanObj', { static: false }) kanbanObj!: KanbanComponent;

  public kanbanData: Object[] = [];

  public columns: ColumnsModel[] = [
    { headerText: 'To Do', keyField: 'Open', allowToggle: true },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
    { headerText: 'Done', keyField: 'Close', allowToggle: true },
  ];

  public cardSettings: CardSettingsModel = {
    headerField: 'Id',
    contentField: 'Summary',
    selectionType: 'Multiple',
    // Pas besoin de `template` ici : tu l’as défini dans le HTML via `#cardSettingsTemplate`
  };

  public swimlaneSettings: SwimlaneSettingsModel = {
    keyField: 'Assignee',
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe((tasks: Task[]) => {
      this.kanbanData = tasks.map((task: Task) => ({
        Id: task._id,
        Title: task.title,
        Summary: task.description,
        Tags: 'Général',
        Status: this.mapStatus(task.status),
        Priority: task.priority,
        Assignee: this.getAssigneeName(task.assignedUser),
        idAssigned: this.getAssigneeId(task.assignedUser),
        Type: 'story',
      }));
    });
  }

  mapStatus(status: string): string {
    switch (status) {
      case 'To Do':
        return 'Open';
      case 'In Progress':
        return 'InProgress';
      case 'Review':
        return 'Review';
      case 'Done':
        return 'Close';
      default:
        return 'Open';
    }
  }

  getAssigneeName(assignee: any): string {
    return typeof assignee === 'string'
      ? assignee
      : assignee?.firstname || 'Unassigned';
  }
  getAssigneeId(assignee: any): string {
    return typeof assignee === 'string' ? assignee : assignee?._id || null;
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
    /* const cardIds = this.kanbanObj.kanbanData.map((obj: { [key: string]: string }) => parseInt(obj['Id'].replace('Task ', ''), 10));
    const cardCount: number = Math.max.apply(Math, cardIds) + 1;
    const cardDetails = {
      Id: 'Task ' + cardCount, Status: 'Open', Priority: 'Normal',
      Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: ''
    };
    this.kanbanObj.openDialog('Add', cardDetails);*/
  }
  cardDoubleClick(args: any): void {
    console.log('Card double-clicked:', args.data);
    const taskId = args.data?.Id;
    if (taskId) {
      const url = `/task-details/${taskId}`;
      window.open(url, '_blank'); // Ouvre dans un nouvel onglet
    }
  }
  onOpen(args: any) {
    // Preventing the modal dialog Open
    args.cancel = true;
  }
}
