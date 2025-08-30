'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconLoader,
  IconAlertTriangleFilled,
  IconTilde,
  IconCalendarFilled,
  IconBoltFilled,
  IconZzz,
  IconCheckbox,
} from '@tabler/icons-react';
import Modal from '@/components/ui/modal';
import { CreateListSchema_Type } from '@/schemas/list';
import { createListSchema } from '@/schemas/list';
import { useList } from '@/contexts/list-context';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newList: any) => void;
  initialData?: Partial<CreateListSchema_Type> & { id?: number };
  isEdit?: boolean;
}

export default function CreateListModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  isEdit = false,
}: CreateListModalProps) {
  const { createList, updateList } = useList();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateListSchema_Type>({
    resolver: zodResolver(createListSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      priority: 'low',
      status: 'not-started',
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        // @ts-ignore
        setValue(key as keyof CreateListSchema_Type, value as any);
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: CreateListSchema_Type) => {
    try {
      if (isEdit && initialData?.id) {
        const updateData = {
          name: data.name,
          description: data.description,
          priority: data.priority,
          status: data.status,
        };
        const updated = await updateList(initialData.id, updateData);
        if (onSuccess) onSuccess(updated);
      } else {
        const listData = {
          name: data.name,
          description: data.description || '',
          priority: data.priority,
          status: data.status,
        };
        // @ts-ignore
        const newList = await createList(listData);
        if (onSuccess) onSuccess(newList);
      }
      reset();
      onClose();
    } catch (error) {
      console.error('🚩 Failed to submit list:', error);
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
      bgColor='black'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 text-white'>
        <div className='space-y-2'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-white'
          >
            List Name *
          </label>
          <input
            id='name'
            type='text'
            {...register('name')}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white
              bg-black text-white
              ${errors.name ? 'border-red-500' : 'border-gray-600'}
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
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
            className='block text-sm font-medium text-white'
          >
            Description
          </label>
          <textarea
            id='description'
            {...register('description')}
            disabled={isSubmitting}
            rows={3}
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white
              bg-black text-white
              ${errors.description ? 'border-red-500' : 'border-gray-600'}
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            placeholder='Optional description'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-white mb-2'>
            Priority
          </label>
          <div className='flex flex-wrap space-y-2 items-center justify-between bg-black rounded-md border border-gray-600 p-2'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='high'
                {...register('priority')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.priority ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('priority') === 'high' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('priority') === 'high' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconAlertTriangleFilled
                  className='text-white mr-1'
                  size={20}
                  strokeLinecap='square'
                  strokeLinejoin='bevel'
                />
                <span>High</span>
              </div>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='medium'
                {...register('priority')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.priority ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('priority') === 'medium' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('priority') === 'medium' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconTilde className='text-white mr-1' size={20} />
                <span>Medium</span>
              </div>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='low'
                {...register('priority')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.priority ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('priority') === 'low' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('priority') === 'low' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconZzz className='text-white mr-1' size={20} />
                <span>Low</span>
              </div>
            </label>
          </div>
          {errors.priority && (
            <p className='text-red-500 text-sm'>{errors.priority.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-white mb-2'>
            Status
          </label>
          <div className='flex flex-wrap space-y-2 items-center justify-between bg-black rounded-md border border-gray-600 p-2'>
            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='not-started'
                {...register('status')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.status ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('status') === 'not-started' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('status') === 'not-started' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconCalendarFilled className='text-white mr-1' size={20} />
                <span>Not Started</span>
              </div>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='in-progress'
                {...register('status')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.status ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('status') === 'in-progress' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('status') === 'in-progress' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconBoltFilled className='text-white mr-1' size={20} />
                <span>In Progress</span>
              </div>
            </label>

            <label className='flex items-center space-x-2 cursor-pointer'>
              <input
                type='radio'
                value='completed'
                {...register('status')}
                disabled={isSubmitting}
                className='hidden'
              />
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${errors.status ? 'border-red-500' : 'border-white'} ${isSubmitting ? 'opacity-50' : ''} ${watch('status') === 'completed' ? 'bg-white' : 'bg-transparent'}`}
              >
                {watch('status') === 'completed' && (
                  <div className='w-3 h-3 rounded-full bg-black'></div>
                )}
              </div>
              <div className='flex items-center'>
                <IconCheckbox className='text-white mr-1' size={20} />
                <span>Completed</span>
              </div>
            </label>
          </div>
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
              flex-1 px-4 py-2 text-white bg-transparent border border-white rounded-md
              hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            '
          >
            Cancel X
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='
              flex-1 flex items-center justify-center gap-2 px-4 py-2 text-black bg-white 
              rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
            '
          >
            {isSubmitting ? (
              <>
                <IconLoader className='animate-spin' size={16} />
                Creating...
              </>
            ) : (
              <>Save :)</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
