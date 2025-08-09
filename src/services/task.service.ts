// src/services/task.service.ts
import axiosApi from '@/axiosApi';
import { TaskSchema_Type as Task } from '@/schemas/task';
import { Priority } from '@/schemas/priority';
import { Status } from '@/schemas/status';

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
      console.log('🔄 [TaskService] Fetching all tasks...');

      console.log('📤 [TaskService] Making GET request to /tasks');
      const response = await axiosApi.get<Task[]>('/tasks');

      console.log(
        '✅ [TaskService] Tasks fetched successfully:',
        response.data.length,
        'tasks'
      );
      console.log('📋 [TaskService] Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🚩 [TaskService] Error fetching all tasks:', error);

      // ✅ Log mais detalhado do erro
      console.error('🚩 [TaskService] Detailed error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });

      throw new Error('Failed to fetch tasks');
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
      console.log('🔄 [TaskService] Fetching tasks by listId...');

      console.log('📤 [TaskService] Making GET request to /tasks');
      const response = await axiosApi.get<Task[]>(`/tasks/listId=${listId}`);

      console.log(
        '✅ [TaskService] Tasks fetched successfully:',
        response.data.length,
        'tasks'
      );
      console.log('📋 [TaskService] Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🚩 [TaskService] Error fetching all tasks:', error);

      // ✅ Log mais detalhado do erro
      console.error('🚩 [TaskService] Detailed error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });

      throw new Error('Failed to fetch tasks');
    }
  }

  // create new task
  public async create(newTask: {
    name: string;
    description: string;
    priority: Priority;
    status: Status;
    listId: number;
  }): Promise<Task> {
    try {
      console.log('🔄 [TaskService] Starting task creation...');
      console.log('📋 [TaskService] Data to be sent:', newTask);

      // Validar dados antes do envio
      console.log('🔍 [TaskService] Validating data...');
      if (!newTask.name || newTask.name.trim().length === 0) {
        console.error('🚩 [TaskService] Validation failed: name is required');
        throw new Error('Task name is required');
      }

      if (newTask.listId <= 0) {
        console.error('🚩 [TaskService] Validation failed: listId is required');
        throw new Error('Task listId is required');
      }

      // log dos headers que serão enviados
      console.log('📤 [TaskService] Making POST request to /tasks');
      console.log('📤 [TaskService] Request config:', {
        url: '/tasks',
        method: 'POST',
        data: newTask,
      });

      const response = await axiosApi.post<Task>('/tasks', newTask);

      console.log('✅ [TaskService] Task created successfully!');
      console.log('📨 [TaskService] Response status:', response.status);
      console.log('📨 [TaskService] Response data:', response.data);
      console.log('📨 [TaskService] Response headers:', response.headers);

      return response.data;
    } catch (error: any) {
      console.error('🚩 [TaskService] Error creating task:', error);

      // log detalhado do erro
      console.error('🚩 [TaskService] Detailed error info:', {
        message: error.message,
        name: error.name,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        },
        stack: error.stack,
      });

      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || 'Invalid task data';
        console.error('🚩 [TaskService] Bad request (400):', errorMessage);
        throw new Error(errorMessage);
      }

      if (error.response?.status === 401) {
        console.error('🚩 [TaskService] Unauthorized (401)');
        throw new Error('Unauthorized access');
      }

      if (error.response?.status === 403) {
        console.error('🚩 [TaskService] Forbidden (403)');
        throw new Error('Access forbidden');
      }

      if (error.response?.status === 500) {
        console.error('🚩 [TaskService] Internal server error (500)');
        throw new Error('Server error');
      }

      console.error('🚩 [TaskService] Unknown error occurred');
      throw new Error('Failed to create task');
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
