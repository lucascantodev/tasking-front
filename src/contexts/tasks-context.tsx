'use client';

import React, { createContext, useContext, useState } from 'react';
import { TaskSchema_Type } from '@/schemas/task';
import { Priority } from '@/schemas/priority';
import { Status } from '@/schemas/status';
import taskService from '@/services/task.service';
import { useAuth } from '@/contexts/auth-context';
import { Task } from '@/dto/task';

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: Task) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTasksByListId: (listId: number) => Task[];
  refreshTasks: () => Promise<void>;
  createTask: (task: {
    name: string;
    description: string;
    priority: Priority;
    status: Status;
    listId: number;
  }) => Promise<TaskSchema_Type>;
  updateTaskService: (
    id: number,
    task: { name?: string; completed?: boolean }
  ) => Promise<TaskSchema_Type>;
  deleteTaskService: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TaskSchema_Type[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshTasks = async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await taskService.getAll();
      setTasks(loadedTasks);
    } catch (error) {
      setError('❌ Failed to load tasks');
      console.error('❌ Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // state management functions (optimistic updates)
  const addTask = (task: TaskSchema_Type) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: number, updatedTask: Partial<TaskSchema_Type>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // service functions (api calls)
  const createTask = async (task: {
    name: string;
    description: string;
    priority: Priority;
    status: Status;
    listId: number;
  }) => {
    try {
      setError(null);
      const newTask = await taskService.create(task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('❌ Failed to create task');
      console.error('❌ Error creating task:', err);
      throw err;
    }
  };

  const updateTaskService = async (
    id: number,
    task: { name?: string; completed?: boolean }
  ) => {
    try {
      setError(null);
      const updatedTask = await taskService.update(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      setError('❌ Failed to update task');
      console.error('❌ Error updating task:', err);
      throw err;
    }
  };

  const deleteTaskService = async (id: number) => {
    try {
      setError(null);
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('❌ Failed to delete task');
      console.error('❌ Error deleting task:', err);
      throw err;
    }
  };

  const getTasksByListId = (listId: number) => {
    return tasks.filter((task) => task.listId === listId);
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
    createTask,
    updateTaskService,
    deleteTaskService,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('🚧 useTasks must be used within a TasksProvider');
  }
  return context;
}
