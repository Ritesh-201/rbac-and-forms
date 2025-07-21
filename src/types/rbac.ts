export type Role = 'admin' | 'employee' | 'guest';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
  notes?: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

// CASL Subject Types
export type Subjects = 'Task' | 'User' | 'Board' | 'all';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface AppAbility {
  can(action: Actions, subject: Subjects): boolean;
  cannot(action: Actions, subject: Subjects): boolean;
}