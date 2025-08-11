'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CreateListSchema_Type } from '@/schemas/list'; 
import { ListService } from '@/services/list.service'; 
import { useAuth } from '@/contexts/auth-context';
import { List } from '@/dto/list';

interface ListContextType {
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  error: string | null;
  setCurrentList: (list: List | null) => void;
  refreshLists: () => Promise<void>;
  createList: (list: CreateListSchema_Type) => Promise<List>;
  updateList: (id: number, list: { name?: string }) => Promise<List>;
  deleteList: (id: number) => Promise<void>;
  // duplicateList: (id: number, newName?: string) => Promise<List>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<List[]>([]);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const listService = ListService.getInstance();

  const refreshLists = async () => {
    console.log(
      '🔍 [ListContext] refreshLists called, isAuthenticated:',
      isAuthenticated
    );

    if (!isAuthenticated) {
      console.log('🔍 [ListContext] User not authenticated, clearing lists');
      setLists([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      console.log('🔄 [ListContext] Starting to refresh lists...');
      setIsLoading(true);
      setError(null);

      const data = await listService.getAll();
      console.log(
        '✅ [ListContext] Lists loaded successfully:',
        data.length,
        'lists'
      );
      setLists(data);
    } catch (err: any) {
      console.error('🚩 [ListContext] Error loading lists:', err);
      setError('❌ Failed to load lists');
    } finally {
      setIsLoading(false);
    }
  };

  const createList = async (list: CreateListSchema_Type) => {
    try {
      console.log('🔄 [ListContext] Creating new list...');
      setError(null);
      const newList = await listService.create(list);
      console.log('✅ [ListContext] List created, updating state...');
      setLists((prev) => [...prev, newList]);
      return newList;
    } catch (err: any) {
      console.error('🚩 [ListContext] Error creating list:', err);
      setError('❌ Failed to create list');
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

  /* const duplicateList = async (id: number, newName?: string) => {
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
  }; */

  useEffect(() => {
    console.log(
      '🔄 [ListContext] useEffect triggered, isAuthenticated:',
      isAuthenticated
    );
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
    // duplicateList,
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
