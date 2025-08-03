'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useList } from '@/contexts/list-context';
import { List } from '@/schemas/list';

export default function EditList({
  params,
}: {
  params: { id: string; listId: string };
}) {
  const router = useRouter();
  const { lists, currentList, setCurrentList, updateList, isLoading, error } =
    useList();

  useEffect(() => {
    const listId = parseInt(params.listId);
    const workspaceId = parseInt(params.id);
    const list = lists.find((l) => l.id === listId);

    if (!list || list.workspaceId !== workspaceId) {
      router.push(`/workspaces/${params.id}`);
      return;
    }

    setCurrentList(list);
  }, [params.id, params.listId, lists, router, setCurrentList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentList) return;

    try {
      await updateList(currentList);
      router.push(`/workspaces/${params.id}`);
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentList) return;
    const { name, value } = e.target;
    setCurrentList({ ...currentList, [name]: value });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-red-600'>{error}</div>
      </div>
    );
  }

  if (!currentList) {
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
        <h1 className='text-2xl font-bold mb-6'>Edit List</h1>

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
              value={currentList.name}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
