import { BaseService } from './base.service';
import task, { Task } from '@/schemas/task';
import { useAuth } from '@/contexts/auth-context';

export class TaskService extends BaseService<Task> {
  private static instance: TaskService;
  protected resource = 'tasks';

  private constructor() {
    super();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public async getAll(): Promise<Task[]> {
    return super.getAll();
  }

  public async getById(id: number): Promise<Task | undefined> {
    return super.getById(id);
  }

  public async getByListId(listId: number): Promise<Task[]> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return [];
    
    const response = await fetch(`${this.API_URL}/${this.resource}?listId=${listId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks for list ${listId}`);
    }
    return response.json();
  }

  public async create(newTask: Omit<Task, 'id'>): Promise<Task> {
    try {
      // Validate the task
      task.parse({ ...newTask, id: 1 }); // temporary id for validation
      return super.create(newTask);
    } catch (error) {
      throw error;
    }
  }

  public async update(updatedTask: Task): Promise<Task> {
    try {
      // Validate the task
      task.parse(updatedTask);
      return super.update(updatedTask);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number): Promise<void> {
    return super.delete(id);
  }
}

export default TaskService.getInstance(); 