export interface TaskUpdate {
  name?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'not-started' | 'in-progress' | 'completed';
}
