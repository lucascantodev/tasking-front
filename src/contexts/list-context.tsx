'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { List } from '@/schemas/List';
import listService from '@/services/list.service';
import { useAuth } from '@/contexts/auth-context';

interface ListContextType {
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  error: string | null;
  setCurrentList: (list: List | null) => void;
  refreshLists: () => Promise<void>;
  getListsByWorkspace: (workspaceId: number) => List[];
  createList: (list: Omit<List, 'id'>) => Promise<List>;
  updateList: (list: List) => Promise<List>;
  deleteList: (id: number) => Promise<void>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listService.getAll(isAuthenticated);
      setLists(data);
    } catch (err) {
      setError('Failed to load lists');
      console.error('Error loading lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getListsByWorkspace = (workspaceId: number) => {
    return lists.filter((list) => list.workspaceId === workspaceId);
  };

  const createList = async (list: Omit<List, 'id'>) => {
    try {
      setError(null);
      const newList = await listService.create(list, isAuthenticated);
      setLists((prev) => [...prev, newList]);
      return newList;
    } catch (err) {
      setError('Failed to create list');
      console.error('Error creating list:', err);
      throw err;
    }
  };

  const updateList = async (list: List) => {
    try {
      setError(null);
      const updatedList = await listService.update(list, isAuthenticated);
      setLists((prev) => prev.map((l) => (l.id === list.id ? updatedList : l)));
      if (currentList?.id === list.id) {
        setCurrentList(updatedList);
      }
      return updatedList;
    } catch (err) {
      setError('Failed to update list');
      console.error('Error updating list:', err);
      throw err;
    }
  };

  const deleteList = async (id: number) => {
    try {
      setError(null);
      await listService.delete(id, isAuthenticated);
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (currentList?.id === id) {
        setCurrentList(null);
      }
    } catch (err) {
      setError('Failed to delete list');
      console.error('Error deleting list:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshLists();
  }, [isAuthenticated]);

  const value = {
    lists,
    currentList,
    isLoading,
    error,
    setCurrentList,
    refreshLists,
    getListsByWorkspace,
    createList,
    updateList,
    deleteList,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
}
