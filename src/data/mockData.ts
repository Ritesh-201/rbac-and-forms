import { User, Task, BoardData } from '../types/rbac';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@company.com'
  },
  {
    id: '2',
    name: 'John Employee',
    role: 'employee',
    email: 'john@company.com'
  },
  {
    id: '3',
    name: 'Guest User',
    role: 'guest',
    email: 'guest@company.com'
  }
];

export const mockEmployees = [
  { id: '2', name: 'John Employee' },
  { id: '4', name: 'Sarah Developer' },
  { id: '5', name: 'Mike DevOps' },
  { id: '6', name: 'Lisa Designer' },
  { id: '7', name: 'Tom Analyst' }
];
export const mockTasks: { [key: string]: Task } = {
  'task-1': {
    id: 'task-1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the new dashboard',
    assignedTo: '2',
    assignedToName: 'John Employee',
    status: 'todo',
    priority: 'high',
    createdAt: '2024-01-15',
    dueDate: '2024-01-25'
  },
  'task-2': {
    id: 'task-2',
    title: 'Implement Authentication',
    description: 'Set up JWT authentication system',
    assignedTo: '2',
    assignedToName: 'John Employee',
    status: 'inprogress',
    priority: 'high',
    createdAt: '2024-01-10',
    dueDate: '2024-01-20'
  },
  'task-3': {
    id: 'task-3',
    title: 'Write Documentation',
    description: 'Document the API endpoints and usage',
    assignedTo: '4',
    assignedToName: 'Sarah Developer',
    status: 'todo',
    priority: 'medium',
    createdAt: '2024-01-12',
    dueDate: '2024-01-30'
  },
  'task-4': {
    id: 'task-4',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure automated testing and deployment',
    assignedTo: '5',
    assignedToName: 'Mike DevOps',
    status: 'done',
    priority: 'medium',
    createdAt: '2024-01-05',
    dueDate: '2024-01-15'
  },
  'task-5': {
    id: 'task-5',
    title: 'Database Migration',
    description: 'Migrate legacy data to new schema',
    assignedTo: '4',
    assignedToName: 'Sarah Developer',
    status: 'inprogress',
    priority: 'high',
    createdAt: '2024-01-08',
    dueDate: '2024-01-18'
  },
  'task-6': {
    id: 'task-6',
    title: 'Performance Optimization',
    description: 'Optimize application load times',
    assignedTo: '5',
    assignedToName: 'Mike DevOps',
    status: 'todo',
    priority: 'low',
    createdAt: '2024-01-14',
    dueDate: '2024-02-01'
  }
};

export const initialBoardData: BoardData = {
  tasks: mockTasks,
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1', 'task-3', 'task-6']
    },
    'inprogress': {
      id: 'inprogress',
      title: 'In Progress',
      taskIds: ['task-2', 'task-5']
    },
    'done': {
      id: 'done',
      title: 'Done',
      taskIds: ['task-4']
    }
  },
  columnOrder: ['todo', 'inprogress', 'done']
};