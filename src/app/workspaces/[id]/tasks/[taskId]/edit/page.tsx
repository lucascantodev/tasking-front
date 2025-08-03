'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useTasks } from '@/contexts/tasks-context';
import listService from '@/services/list.service';
import taskService from '@/services/task.service';
import { Task } from '@/schemas/task';
import { List } from '@/schemas/list';

export default function EditTask({
  params,
}: {
  params: { id: string; taskId: string };
}) {
  const router = useRouter();
  const { tasks, updateTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const taskId = parseInt(params.taskId);
        const foundTask = tasks.find((t) => t.id === taskId);

        if (!foundTask) {
          router.push(`/workspaces/${params.id}`);
          return;
        }

        // Verify that the task belongs to a list in this workspace
        const workspaceLists = await listService.getByWorkspaceId(
          parseInt(params.id)
        );
        const taskList = workspaceLists.find((l) => l.id === foundTask.listId);

        if (!taskList) {
          router.push(`/workspaces/${params.id}`);
          return;
        }

        setTask(foundTask);
        setLists(workspaceLists);
      } catch (error) {
        console.error('Error loading task data:', error);
        router.push(`/workspaces/${params.id}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, params.taskId, router, tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      setIsSubmitting(true);
      await taskService.update(task);
      updateTask(task.id, task);
      router.push(`/workspaces/${params.id}`);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!task) return;
    const { name, value } = e.target;
    setTask((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className='container mx-auto p-4'>
      <Link
        href={`/workspaces/${params.id}`}
        className='inline-flex items-center text-blue-600 mb-6'
      >
        <IconArrowLeft size={18} className='mr-1' />
        Back to Workspace
      </Link>

      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Edit Task</h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={task.name}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label
              htmlFor='listId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              List
            </label>
            <select
              id='listId'
              name='listId'
              value={task.listId}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
