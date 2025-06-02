"use client";

import React, { createContext, useContext, useState } from 'react';
import { Task } from '@/schemas/Task';
import taskService from '@/services/task.service';

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTasksByListId: (listId: number) => Task[];
  refreshTasks: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await taskService.getAll();
      setTasks(loadedTasks);
    } catch (error) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksByListId = (listId: number) => {
    return tasks.filter(task => task.listId === listId);
  };

  const value = {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getTasksByListId,
    refreshTasks,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
} 