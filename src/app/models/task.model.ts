export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: string;
  assignedUser?: string | { _id: string; firstname: string }; // selon que tu fasses un populate ou non
  comments?: any[];
  createdAt?: string;
  updatedAt?: string;
}
