import { map } from "rxjs";

interface TaskUpdate {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedUser: string | null;
  tags: string;
  priority: string;
  projectId: string;
  dueDate?: string;
}

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

  static toTaskObject(card: any): TaskUpdate {
    // Only include essential fields for task update
    const taskUpdate: TaskUpdate = {
      _id: card.Id,
      title: card.Title,
      description: card.Summary,
      status: this.mapStatus(card.Status),
      assignedUser: card.idAssigned || null,
      tags: card.Tags,
      priority: card.Priority,
      projectId: card.ProjectId,
    };

    // Only include dueDate if it exists
    if (card.DueDate) {
      taskUpdate.dueDate = card.DueDate;
    }

    return taskUpdate;
  }

  static mapStatus(Status: any): string {
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
