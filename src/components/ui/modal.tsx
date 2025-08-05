'use client';

import { ReactNode, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // close modal with ESC
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className='fixed inset-0 z-20 overflow-y-auto'>
      <div
        className='fixed inset-0 bg-black opacity-40 transition-opacity'
        onClick={onClose}
      />
      <div className='flex min-h-full items-center justify-center p-4'>
        <div
          className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl
            transform transition-all duration-300 ease-in-out
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
            <button
              onClick={onClose}
              className='
                p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                rounded-full transition-colors duration-200 cursor-pointer
              '
            >
              <IconX size={20} />
            </button>
          </div>
          <div className='p-6'>{children}</div>
        </div>
      </div>
    </div>
  );
}
