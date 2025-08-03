'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useWorkspaces } from '@/contexts/workspaces-context';
import { Workspace } from '@/schemas/workspace';
import { useAuth } from '@/contexts/auth-context';
import workspaceService from '@/services/workspace.service';

export default function NewWorkspace() {
  const router = useRouter();
  const { addWorkspace } = useWorkspaces();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Workspace, 'id' | 'userId'>>({
    name: '',
    description: '',
    priority: 'medium',
    status: 'not-started',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a workspace');
      return;
    }

    try {
      setIsSubmitting(true);
      const newWorkspace = await workspaceService.create({
        ...formData,
        userId: parseInt(user.id),
      });
      addWorkspace(newWorkspace);
      router.push(`/workspaces/${newWorkspace.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='container mx-auto p-4'>
      <Link
        href='/workspaces'
        className='inline-flex items-center text-blue-600 mb-6'
      >
        <IconArrowLeft size={18} className='mr-1' />
        Back to Workspaces
      </Link>

      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Create New Workspace</h1>

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
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label
              htmlFor='priority'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Priority
            </label>
            <select
              id='priority'
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Status
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='not-started'>Not Started</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
              <option value='waiting'>Waiting</option>
            </select>
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {isSubmitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
