'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace } from '@/schemas/Workspace';
import workspaceService from '@/services/workspace.service';
import { useAuth } from '@/contexts/auth-context';

interface WorkspacesContextType {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: number, workspace: Partial<Workspace>) => void;
  deleteWorkspace: (id: number) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(
  undefined
);

export function WorkspacesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedWorkspaces = await workspaceService.getAll(isAuthenticated);
      setWorkspaces(loadedWorkspaces);
    } catch (error) {
      setError('Failed to load workspaces');
      console.error('Error loading workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWorkspaces();
  }, [isAuthenticated]);

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
  };

  const updateWorkspace = (
    id: number,
    updatedWorkspace: Partial<Workspace>
  ) => {
    setWorkspaces((prev) =>
      prev.map((workspace) =>
        workspace.id === id ? { ...workspace, ...updatedWorkspace } : workspace
      )
    );
  };

  const deleteWorkspace = (id: number) => {
    setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id));
  };

  const value = {
    workspaces,
    isLoading,
    error,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refreshWorkspaces,
  };

  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
}

export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider');
  }

  // TODO: Remover esse default quando terminar de estilizar os cards do workspace
  return {
    workspaces: [
      {
        id: 1,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 2,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 3,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 4,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 5,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 6,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 7,
        userId: 1,
        name: 'workspace',
        description:
          'This workspace helps me organize all my home-related tasks in one place. I use it to keep track of chores, grocery shopping, maintenance, and other things I need to do around the house. It makes it easy to see what’s pending, set priorities, and make sure nothing gets forgotten in my daily routine.',
        priority: 'low',
        status: 'waiting',
      },
      {
        id: 8,
        userId: 1,
        name: 'workspace',
        description: 'none.',
        priority: 'low',
        status: 'waiting',
      },
    ],
    isLoading: false,
    error: null,
    addWorkspace: (workspace: Workspace) => {
      return;
    },
    updateWorkspace: (id: number, workspace: Partial<Workspace>) => {
      return;
    },
    deleteWorkspace: (id: number) => {
      return;
    },
    refreshWorkspaces: () => {
      return Promise;
    },
  };

  return context;
}
