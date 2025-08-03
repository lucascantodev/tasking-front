'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ListSchema_Type } from '@/schemas/list';
import listService from '@/services/list.service';
import { useAuth } from '@/contexts/auth-context';
import { List } from '@/dto/list';

interface ListContextType {
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  error: string | null;
  setCurrentList: (list: List | null) => void;
  refreshLists: () => Promise<void>;
  createList: (list: { name: string }) => Promise<ListSchema_Type>;
  updateList: (id: number, list: { name?: string }) => Promise<ListSchema_Type>;
  deleteList: (id: number) => Promise<void>;
  duplicateList: (id: number, newName?: string) => Promise<ListSchema_Type>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshLists = async () => {
    if (!isAuthenticated) {
      setLists([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await listService.getAll();
      setLists(data);
    } catch (err) {
      setError('❌ Failed to load lists');
      console.error('❌ Error loading lists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createList = async (list: { name: string }) => {
    try {
      setError(null);
      const newList = await listService.create(list);
      setLists((prev) => [...prev, newList]);
      return newList;
    } catch (err) {
      setError('❌ Failed to create list');
      console.error('❌ Error creating list:', err);
      throw err;
    }
  };

  const updateList = async (id: number, list: { name?: string }) => {
    try {
      setError(null);
      const updatedList = await listService.update(id, list);
      setLists((prev) => prev.map((l) => (l.id === id ? updatedList : l)));
      if (currentList?.id === id) {
        setCurrentList(updatedList);
      }
      return updatedList;
    } catch (err) {
      setError('❌ Failed to update list');
      console.error('❌ Error updating list:', err);
      throw err;
    }
  };

  const deleteList = async (id: number) => {
    try {
      setError(null);
      await listService.delete(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (currentList?.id === id) {
        setCurrentList(null);
      }
    } catch (err) {
      setError('❌ Failed to delete list');
      console.error('❌ Error deleting list:', err);
      throw err;
    }
  };

  const duplicateList = async (id: number, newName?: string) => {
    try {
      setError(null);
      const duplicatedList = await listService.duplicate(id, newName);
      setLists((prev) => [...prev, duplicatedList]);
      return duplicatedList;
    } catch (err) {
      setError('❌ Failed to duplicate list');
      console.error('❌ Error duplicating list:', err);
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
    createList,
    updateList,
    deleteList,
    duplicateList,
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
