import { BaseService } from './base.service';
import list, { List } from '@/schemas/list';

export class ListService extends BaseService<List> {
  private static instance: ListService;
  protected resource = 'lists';

  private constructor() {
    super();
  }

  public static getInstance(): ListService {
    if (!ListService.instance) {
      ListService.instance = new ListService();
    }
    return ListService.instance;
  }

  public async getAll(isAuthenticated: boolean): Promise<List[]> {
    if (!isAuthenticated) return [];
    return super.getAll();
  }

  public async getById(id: number, isAuthenticated: boolean): Promise<List | undefined> {
    if (!isAuthenticated) return undefined;
    return super.getById(id);
  }

  public async getByWorkspaceId(workspaceId: number, isAuthenticated: boolean): Promise<List[]> {
    if (!isAuthenticated) return [];
    
    const response = await fetch(`${this.API_URL}/${this.resource}?workspaceId=${workspaceId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lists for workspace ${workspaceId}`);
    }
    return response.json();
  }

  public async create(newList: Omit<List, 'id'>, isAuthenticated: boolean): Promise<List> {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to create a list');
    }

    try {
      // Validate the list
      list.parse({ ...newList, id: 1 }); // temporary id for validation
      return super.create(newList);
    } catch (error) {
      throw error;
    }
  }

  public async update(updatedList: List, isAuthenticated: boolean): Promise<List> {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to update a list');
    }

    try {
      // Validate the list
      list.parse(updatedList);
      return super.update(updatedList);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, isAuthenticated: boolean): Promise<void> {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to delete a list');
    }
    return super.delete(id);
  }
}

export default ListService.getInstance(); 