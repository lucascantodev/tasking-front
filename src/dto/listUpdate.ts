export interface ListUpdate {
  name?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'not-started' | 'in-progress' | 'completed';
