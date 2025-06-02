// src/services/workspace.service.ts
import { BaseService } from './base.service';
import workspace, { Workspace } from '@/schemas/Workspace';

export class WorkspaceService extends BaseService<Workspace> {
  private static instance: WorkspaceService;
  protected resource = 'workspaces';

  private constructor() {
    super();
  }

  public static getInstance(): WorkspaceService {
    if (!WorkspaceService.instance) {
      WorkspaceService.instance = new WorkspaceService();
    }
    return WorkspaceService.instance;
  }

  public async getAll(isAuthenticated: boolean): Promise<Workspace[]> {
    if (!isAuthenticated) return [];
    return super.getAll();
  }

  public async getById(id: number, isAuthenticated: boolean): Promise<Workspace | undefined> {
    if (!isAuthenticated) return undefined;
    return super.getById(id);
  }

  public async create(newWorkspace: Omit<Workspace, 'id'>, isAuthenticated: boolean, user: any): Promise<Workspace> {
    if (!isAuthenticated || !user) {
      throw new Error('User must be authenticated to create a workspace');
    }

    try {
      // Validate the workspace
      workspace.parse({ ...newWorkspace, id: 1 }); // temporary id for validation
      return super.create(newWorkspace);
    } catch (error) {
      throw error;
    }
  }

  public async update(updatedWorkspace: Workspace, isAuthenticated: boolean): Promise<Workspace> {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to update a workspace');
    }

    try {
      // Validate the workspace
      workspace.parse(updatedWorkspace);
      return super.update(updatedWorkspace);
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number, isAuthenticated: boolean): Promise<void> {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to delete a workspace');
    }
    return super.delete(id);
  }
}

export default WorkspaceService.getInstance();
