import { Task } from '../types.ts';

const STORAGE_KEY = 'taskflow_tasks_v1';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'demo-1',
    text: 'Welcome to TaskFlow! 👋 Click the circle to mark this completed',
    completed: false,
    createdAt: Date.now() - 3600000 * 4,
    category: 'General',
    priority: 'low',
  },
  {
    id: 'demo-2',
    text: 'Plan dinner recipe and buy groceries',
    completed: true,
    createdAt: Date.now() - 3600000 * 3,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Shopping',
    priority: 'medium',
  },
  {
    id: 'demo-3',
    text: 'Review project presentation slides',
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    category: 'Work',
    priority: 'high',
  },
  {
    id: 'demo-4',
    text: 'Take a relaxing 20-minute evening walk',
    completed: false,
    createdAt: Date.now() - 3600000,
    category: 'Health',
    priority: 'low',
  },
];

export function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}
