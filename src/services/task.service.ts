// src/services/task.service.ts
import axiosApi from '@/api/axiosApi';
import { Task } from '@/schemas/task';

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  // get all user tasks
  public async getAll(): Promise<Task[]> {
    try {
      const response = await axiosApi.get<Task[]>('/tasks');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching all tasks:', error);
      throw new Error('❌ Failed to fetch tasks');
    }
  }

  // get task by id
  public async getById(id: number): Promise<Task | null> {
    try {
      const response = await axiosApi.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`❌ Error fetching task ${id}:`, error);
      throw new Error('❌ Failed to fetch task');
    }
  }

  // get tasks by list id
  public async getByListId(listId: number): Promise<Task[]> {
    try {
      const response = await axiosApi.get<Task[]>(`/tasks?listId=${listId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching tasks for list ${listId}:`, error);
      throw new Error(`❌ Failed to fetch tasks for list ${listId}`);
    }
  }

  // create new task
  public async create(newTask: {
    name: string;
    listId: number;
  }): Promise<Task> {
    try {
      // validate data before sending
      this.validateTask(newTask);

      const response = await axiosApi.post<Task>('/tasks', newTask);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating task:', error);

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || '🚧 Invalid task data');
      }

      throw new Error('❌ Failed to create task');
    }
  }

  // update task
  public async update(
    id: number,
    updatedTask: { name?: string; isComplete?: boolean }
  ): Promise<Task> {
    try {
      // validate data if provided
      if (updatedTask.name !== undefined) {
        this.validateTask(updatedTask);
      }

      const response = await axiosApi.put<Task>(`/tasks/${id}`, updatedTask);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error updating task ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('❌ Task not found');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || '🚧 Invalid task data');
      }

      throw new Error('❌ Failed to update task');
    }
  }

  // delete task
  public async delete(id: number): Promise<void> {
    try {
      await axiosApi.delete(`/tasks/${id}`);
    } catch (error: any) {
      console.error(`❌ Error deleting task ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('❌ Task not found');
      }

      throw new Error('❌ Failed to delete task');
    }
  }

  // toggle task completion
  public async toggleComplete(id: number): Promise<Task> {
    try {
      const task = await this.getById(id);

      if (!task) {
        throw new Error('❌ Task not found');
      }

      return await this.update(id, { isComplete: !task.isComplete });
    } catch (error) {
      console.error(`❌ Error toggling task ${id}:`, error);
      throw new Error('❌ Failed to toggle task');
    }
  }

  // duplicate task
  public async duplicate(id: number, newName?: string): Promise<Task> {
    try {
      const originalTask = await this.getById(id);

      if (!originalTask) {
        throw new Error('❌ Task not found');
      }

      const duplicatedTask = {
        name: newName || `${originalTask.name} (Copy)`,
        listId: originalTask.listId,
      };

      return await this.create(duplicatedTask);
    } catch (error) {
      console.error(`❌ Error duplicating task ${id}:`, error);
      throw new Error('❌ Failed to duplicate task');
    }
  }

  // validate task data
  private validateTask(taskData: { name?: string; listId?: number }): void {
    if (
      taskData.name !== undefined &&
      (!taskData.name || taskData.name.trim().length === 0)
    ) {
      throw new Error('🚧 Task name is required');
    }

    if (taskData.name && taskData.name.trim().length > 200) {
      throw new Error('🚧 Task name must be less than 200 characters');
    }

    if (taskData.listId !== undefined && taskData.listId <= 0) {
      throw new Error('🚧 Valid list ID is required');
    }
  }
}

export default TaskService.getInstance();
