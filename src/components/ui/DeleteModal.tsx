'use client';

import React from 'react';
import Modal from './modal';
import { IconTrash, IconX } from '@tabler/icons-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  resourceName?: string;
  loading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  resourceName = 'item',
  loading = false,
}: DeleteModalProps) {
  const size = window.matchMedia('(min-width: 1536px)').matches ? 'lg' : 'md';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={''}
      size={size}
      bgColor='black'
    >
      <div className='flex flex-col items-center justify-center space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6'>
        <span className='text-2xl 2xl:text-3xl 4xl:text-4xl font-semibold text-white text-center leading-tight'>
          Are you sure you want to delete this {resourceName}?
        </span>
        <div className='flex flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mt-2 sm:mt-4 w-full sm:w-auto'>
          <button
            type='button'
            className='flex justify-center items-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 cursor-pointer border border-white rounded-md text-white hover:bg-white hover:text-black transition-colors text-lg 2xl:text-2xl 4xl:text-4xl font-medium disabled:opacity-50'
            onClick={onDelete}
            disabled={loading}
          >
            <IconTrash
              size={16}
              className='sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10'
            />{' '}
            Delete
          </button>
          <button
            type='button'
            className='flex justify-center items-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 cursor-pointer border border-white rounded-md text-white hover:bg-white hover:text-black transition-colors text-lg 2xl:text-2xl 4xl:text-4xl font-medium disabled:opacity-50 '
            onClick={onClose}
            disabled={loading}
          >
            <IconX
              size={16}
              className='sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10'
            />{' '}
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
