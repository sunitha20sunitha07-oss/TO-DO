export type Priority = 'low' | 'medium' | 'high';

export type Category = 'General' | 'Personal' | 'Work' | 'Study' | 'Health' | 'Shopping';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: string;
  category: Category;
  priority: Priority;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'newest' | 'oldest' | 'priority' | 'alphabetical' | 'dueDate';
