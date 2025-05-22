export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: string | { _id: string; title: string }; 
  assignedUser?: string | { _id: string; firstname: string; lastname: string; }; 
  tags?: string;
  comments?: any[];
  createdAt?: string;
  updatedAt?: string;

}
