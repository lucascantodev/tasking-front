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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={''}
      size="md"
      bgColor="black"
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        <span className="text-2xl font-semibold text-white text-center">
          Are you sure you want to delete this {resourceName}?
        </span>
        <div className="flex flex-row gap-8 mt-4">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2 cursor-pointer border border-white rounded-md text-white hover:bg-white hover:text-black transition-colors text-lg font-medium disabled:opacity-50"
            onClick={onDelete}
            disabled={loading}
          >
            <IconTrash size={20} /> Delete
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2 cursor-pointer border border-white rounded-md text-white hover:bg-white hover:text-black transition-colors text-lg font-medium disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            <IconX size={20} /> Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}