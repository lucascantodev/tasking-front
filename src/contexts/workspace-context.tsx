'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace } from '@/schemas/Workspace';
import workspaceService from '@/services/workspace.service';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (workspace: Omit<Workspace, 'id'>) => Promise<Workspace>;
  updateWorkspace: (workspace: Workspace) => Promise<Workspace>;
  deleteWorkspace: (id: number) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await workspaceService.getAll();
      setWorkspaces(data);
    } catch (err) {
      setError('Failed to load workspaces');
      console.error('Error loading workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkspace = async (workspace: Omit<Workspace, 'id'>) => {
    try {
      setError(null);
      const newWorkspace = await workspaceService.create(workspace);
      setWorkspaces((prev) => [...prev, newWorkspace]);
      return newWorkspace;
    } catch (err) {
      setError('Failed to create workspace');
      console.error('Error creating workspace:', err);
      throw err;
    }
  };

  const updateWorkspace = async (workspace: Workspace) => {
    try {
      setError(null);
      const updatedWorkspace = await workspaceService.update(workspace);
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === workspace.id ? updatedWorkspace : w))
      );
      if (currentWorkspace?.id === workspace.id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      return updatedWorkspace;
    } catch (err) {
      setError('Failed to update workspace');
      console.error('Error updating workspace:', err);
      throw err;
    }
  };

  const deleteWorkspace = async (id: number) => {
    try {
      setError(null);
      await workspaceService.delete(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(null);
      }
    } catch (err) {
      setError('Failed to delete workspace');
      console.error('Error deleting workspace:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshWorkspaces();
  }, []);

  const value = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    setCurrentWorkspace,
    refreshWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
