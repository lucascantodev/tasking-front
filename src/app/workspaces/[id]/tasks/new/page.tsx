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

export default function NewTask({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addTask } = useTasks();
  const [lists, setLists] = useState<List[]>([]);
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    listId: 0,
    name: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      try {
        const workspaceLists = await listService.getByWorkspaceId(
          parseInt(params.id)
        );
        setLists(workspaceLists);

        if (workspaceLists.length > 0) {
          setFormData((prev) => ({ ...prev, listId: workspaceLists[0].id }));
        }
      } catch (error) {
        console.error('Error loading lists:', error);
        router.push(`/workspaces/${params.id}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadLists();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newTask = await taskService.create(formData);
      addTask(newTask);
      router.push(`/workspaces/${params.id}`);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (lists.length === 0) {
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
          <div className='bg-yellow-100 border-l-4 border-yellow-500 p-4'>
            <p className='text-yellow-700'>
              You need to create a list before adding tasks. Please create a
              list first.
            </p>
          </div>
        </div>
      </div>
    );
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
        <h1 className='text-2xl font-bold mb-6'>Create New Task</h1>

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
              value={formData.name}
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
              value={formData.listId}
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
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
