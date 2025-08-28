import axiosApi from '@/axiosApi';
import { List } from '@/dto/list';
import { CreateListSchema_Type } from '@/schemas/list';

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
      console.log('🔄 [ListService] Fetching all lists...');

      /* const token =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');
      console.log('🔍 [ListService] Token check:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenPreview: token?.substring(0, 20) + '...',
      }); */

      console.log('📤 [ListService] Making GET request to /lists');
      const response = await axiosApi.get<List[]>('/lists/');

      console.log(
        '✅ [ListService] Lists fetched successfully:',
        response.data.length,
        'lists'
      );
      console.log('📋 [ListService] Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('🚩 [ListService] Error fetching all lists:', error);

      // ✅ Log mais detalhado do erro
      console.error('🚩 [ListService] Detailed error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });

      throw new Error('Failed to fetch lists');
    }
  }

  // get list by id
  public async getById(id: number): Promise<List | null> {
    try {
      console.log(`🔄 [ListService] Fetching list with id: ${id}`);
      const response = await axiosApi.get<List>(`/lists/${id}/`);
      console.log('✅ [ListService] List fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`ℹ️ [ListService] List ${id} not found`);
        return null;
      }
      console.error(`🚩 [ListService] Error fetching list ${id}:`, error);
      console.error('🚩 [ListService] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error('Failed to fetch list');
    }
  }

  // create new list
  public async create(newList: CreateListSchema_Type): Promise<List> {
    try {
      console.log('🔄 [ListService] Starting list creation...');
      console.log('📋 [ListService] Data to be sent:', newList);

      // Validar dados antes do envio
      console.log('🔍 [ListService] Validating data...');
      if (!newList.name || newList.name.trim().length === 0) {
        console.error('🚩 [ListService] Validation failed: name is required');
        throw new Error('List name is required');
      }

      // log dos headers que serão enviados
      console.log('📤 [ListService] Making POST request to /lists');
      console.log('📤 [ListService] Request config:', {
        url: '/lists',
        method: 'POST',
        data: newList,
      });

      const response = await axiosApi.post<List>('/lists/', newList);

      console.log('✅ [ListService] List created successfully!');
      console.log('📨 [ListService] Response status:', response.status);
      console.log('📨 [ListService] Response data:', response.data);
      console.log('📨 [ListService] Response headers:', response.headers);

      return response.data;
    } catch (error: any) {
      console.error('🚩 [ListService] Error creating list:', error);

      // log detalhado do erro
      console.error('🚩 [ListService] Detailed error info:', {
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
        const errorMessage = error.response.data.message || 'Invalid list data';
        console.error('🚩 [ListService] Bad request (400):', errorMessage);
        throw new Error(errorMessage);
      }

      if (error.response?.status === 401) {
        console.error('🚩 [ListService] Unauthorized (401)');
        throw new Error('Unauthorized access');
      }

      if (error.response?.status === 403) {
        console.error('🚩 [ListService] Forbidden (403)');
        throw new Error('Access forbidden');
      }

      if (error.response?.status === 500) {
        console.error('🚩 [ListService] Internal server error (500)');
        throw new Error('Server error');
      }

      console.error('🚩 [ListService] Unknown error occurred');
      throw new Error('Failed to create list');
    }
  }

  // update list
  public async update(
    id: number,
    updatedList: {
      name?: string;
      description?: string;
      priority?: string;
      status?: string;
    }
  ): Promise<List> {
    try {
      console.log(`🔄 [ListService] Updating list ${id}...`);
      console.log('📋 [ListService] Update data:', updatedList);

      const response = await axiosApi.put<List>(`/lists/${id}/`, updatedList);

      console.log('✅ [ListService] List updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`🚩 [ListService] Error updating list ${id}:`, error);
      console.error('🚩 [ListService] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 404) {
        throw new Error('List not found');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Invalid list data');
      }

      throw new Error('Failed to update list');
    }
  }

  // delete list
  public async delete(id: number): Promise<void> {
    try {
      console.log(`🔄 [ListService] Deleting list ${id}...`);
      await axiosApi.delete(`/lists/${id}/`);
      console.log(`✅ [ListService] List ${id} deleted successfully`);
    } catch (error: any) {
      console.error(`🚩 [ListService] Error deleting list ${id}:`, error);
      console.error('🚩 [ListService] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 404) {
        throw new Error('List not found');
      }

      throw new Error('Failed to delete list');
    }
  }

  // duplicate list
  /*   public async duplicate(id: number, newName?: string): Promise<List> {
    try {
      console.log(`🔄 [ListService] Duplicating list ${id}...`);

      const originalList = await this.getById(id);

      if (!originalList) {
        throw new Error('List not found');
      }

      console.log('📋 [ListService] Original list:', originalList);

      const duplicatedList = {
        name: newName || `${originalList.name} (Copy)`,
        description: originalList.description,
        priority: originalList.priority,
        status: 'not-started',
      };

      console.log('📋 [ListService] Duplicated list data:', duplicatedList);

      return await this.create(duplicatedList);
    } catch (error) {
      console.error(`🚩 [ListService] Error duplicating list ${id}:`, error);
      throw new Error('Failed to duplicate list');
    }
  } */
}

export default ListService.getInstance();
