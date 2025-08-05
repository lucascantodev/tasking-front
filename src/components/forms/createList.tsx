'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader, IconPlus } from '@tabler/icons-react';
import Modal from '@/components/ui/modal';
import { ListSchema_Type } from '@/schemas/list';
import listSchema from '@/schemas/list';
import { ListService } from '@/services/list.service';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newList: any) => void;
}

export default function CreateListModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateListModalProps) {
  const listService = ListService.getInstance();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ListSchema_Type>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: 'low',
      status: 'not-started',
    },
  });

  const onSubmit = async (data: ListSchema_Type) => {
    console.log('Data completo:', data);
    try {
      const newList = await listService.create(data);
      if (onSuccess) {
        onSuccess(newList);
      }
      onClose();
      reset();
      console.log('✅ List created successfully!');
    } catch (error) {
      console.error('🚩 Failed to create list:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Create New List'
      size='md'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            List Name *
          </label>
          <input
            id='name'
            type='text'
            {...register('name')}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.name ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
            placeholder='Enter list name'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <textarea
            id='description'
            {...register('description')}
            disabled={isSubmitting}
            rows={3}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
            placeholder='Optional description'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='priority'
            className='block text-sm font-medium text-gray-700'
          >
            Priority
          </label>
          <select
            id='priority'
            {...register('priority')}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.priority ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          >
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
          {errors.priority && (
            <p className='text-red-500 text-sm'>{errors.priority.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-gray-700'
          >
            Status
          </label>
          <select
            id='status'
            {...register('status')}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.status ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          >
            <option value='not-started'>Not Started</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
            <option value='waiting'>Waiting</option>
          </select>
          {errors.status && (
            <p className='text-red-500 text-sm'>{errors.status.message}</p>
          )}
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isSubmitting}
            className='
              flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md
              hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            '
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='
              flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 
              rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            '
          >
            {isSubmitting ? (
              <>
                <IconLoader className='animate-spin' size={16} />
                Creating...
              </>
            ) : (
              <>
                <IconPlus size={16} />
                Create List
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
