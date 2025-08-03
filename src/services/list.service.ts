import axiosApi from '@/api/axiosApi';
import { List } from '@/dto/list';

export class ListService {
  private static instance: ListService;

  private constructor() {}

  public static getInstance(): ListService {
    if (!ListService.instance) {
      ListService.instance = new ListService();
    }
    return ListService.instance;
  }

  // get all user lists
  public async getAll(): Promise<List[]> {
    try {
      const response = await axiosApi.get<List[]>('/lists');
      return response.data;
    } catch (error) {
      console.error('🚩 Error fetching all lists:', error);
      throw new Error('🚩 Failed to fetch lists');
    }
  }

  // get list by id
  public async getById(id: number): Promise<List | null> {
    try {
      const response = await axiosApi.get<List>(`/lists/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error(`🚩 Error fetching list ${id}:`, error);
      throw new Error('🚩 Failed to fetch list');
    }
  }

  // create new list
  public async create(newList: { name: string }): Promise<List> {
    try {
      // validate data before sending
      this.validateList(newList);

      const response = await axiosApi.post<List>('/lists', newList);
      return response.data;
    } catch (error: any) {
      console.error('🚩 Error creating list:', error);

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || '🚧 Invalid list data');
      }

      throw new Error('🚩 Failed to create list');
    }
  }

  // update list
  public async update(
    id: number,
    updatedList: { name?: string }
  ): Promise<List> {
    try {
      // validate data if provided
      if (updatedList.name !== undefined) {
        this.validateList(updatedList);
      }

      const response = await axiosApi.put<List>(`/lists/${id}`, updatedList);
      return response.data;
    } catch (error: any) {
      console.error(`🚩 Error updating list ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('🚩 List not found');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || '🚧 Invalid list data');
      }

      throw new Error('🚩 Failed to update list');
    }
  }

  // delete list
  public async delete(id: number): Promise<void> {
    try {
      await axiosApi.delete(`/lists/${id}`);
    } catch (error: any) {
      console.error(`Error deleting list ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error('🚩 List not found');
      }

      throw new Error('🚩 Failed to delete list');
    }
  }

  // duplicate list
  public async duplicate(id: number, newName?: string): Promise<List> {
    try {
      const originalList = await this.getById(id);

      if (!originalList) {
        throw new Error('🚩 List not found');
      }

      const duplicatedList = {
        name: newName || `${originalList.name} (Copy)`,
      };

      return await this.create(duplicatedList);
    } catch (error) {
      console.error(`🚩 Error duplicating list ${id}:`, error);
      throw new Error('🚩 Failed to duplicate list');
    }
  }

  // validate list data
  private validateList(listData: { name?: string }): void {
    if (
      listData.name !== undefined &&
      (!listData.name || listData.name.trim().length === 0)
    ) {
      throw new Error('🚧 List name is required');
    }

    if (listData.name && listData.name.trim().length > 100) {
      throw new Error('🚧 List name must be less than 100 characters');
    }
  }
}

export default ListService.getInstance();
