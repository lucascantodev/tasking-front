export interface Task {
  id: number;
  listId: number;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not-started' | 'in-progress' | 'completed';
  isComplete: boolean;
}
