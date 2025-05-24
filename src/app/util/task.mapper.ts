import { map } from "rxjs";

// task-kanban.mapper.ts
export class TaskKanbanMapper {
  static toKanbanCard(task: any): any {
    return {
      Id: task._id,
      Title: task.title,
      Summary: task.description,
      Status: task.status,
      Assignee: task.assignee,
      Tags: task.tags?.join(','),
      Priority: task.priority
    };
  }

 
  static toTaskObject(card: any): any {
    return {
      _id: card.Id,
      title: card.Title,
      description: card.Summary,
      status: this.mapStatus(card.Status),
      assignedUser: card.idAssigned || null,
      tags: card.Tags ,
      priority: card.Priority,
      dueDate: new Date().toISOString(), 
      projectId: card.ProjectId,
    };
    }
    static mapStatus(Status: any) {
        switch (Status) {
            case 'Open':
                return 'To Do';
            case 'InProgress':
                return 'In Progress';
            case 'Review':
                return 'Review';
            case 'Close':
                return 'Done';
            default:
                return 'Open';
        }
    }
}
