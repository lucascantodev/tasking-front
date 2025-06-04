import { useAuth } from '@/contexts/auth-context';
import axios from 'axios';

export abstract class BaseService<T> {
  protected readonly API_URL = 'http://localhost:3001';
  protected abstract resource: string;
  protected axiosInstance = axios.create({
    baseURL: this.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  protected async getAll(): Promise<T[]> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return [];

    const response = await this.axiosInstance.get<T[]>(`/${this.resource}`);
    return response.data;
  }

  protected async getById(id: number): Promise<T | undefined> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return undefined;

    try {
      const response = await this.axiosInstance.get<T>(
        `/${this.resource}/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  protected async create(data: Omit<T, 'id'>): Promise<T> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      throw new Error(
        `User must be authenticated to create a ${this.resource}`
      );
    }

    const response = await this.axiosInstance.post<T>(
      `/${this.resource}`,
      data
    );
    return response.data;
  }

  protected async update(data: T & { id: number }): Promise<T> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      throw new Error(
        `User must be authenticated to update a ${this.resource}`
      );
    }

    const response = await this.axiosInstance.put<T>(
      `/${this.resource}/${data.id}`,
      data
    );
    return response.data;
  }

  protected async delete(id: number): Promise<void> {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      throw new Error(
        `User must be authenticated to delete a ${this.resource}`
      );
    }

    await this.axiosInstance.delete(`/${this.resource}/${id}`);
  }
}
