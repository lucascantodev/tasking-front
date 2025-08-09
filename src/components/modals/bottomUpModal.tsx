'use client';

import { useEffect, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function BottomUpModal({
  isOpen,
  onClose,
  children,
  className,
  title,
}: MobileModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    // Delay actual close to allow slide-down animation
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isAnimating) return <>{children}</>;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isAnimating && isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className='dark fixed inset-0 z-50 flex items-end justify-center pointer-events-none'>
        <div
          className={cn(
            'dark w-full h-[75vh] bg-background border-t border-border rounded-t-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out',
            // Slide animation
            isAnimating && isOpen ? 'translate-y-0' : 'translate-y-full',
            className
          )}
        >
          {/* Header with close button */}
          <div className='dark flex items-center justify-between p-4 border-b border-border'>
            {/* Drag Handle */}
            <div
              className='
              dark w-12 h-1 bg-muted rounded-full mx-auto absolute left-1/2 top-2 transform 
              -translate-x-1/2
            '
            />

            {/* Title */}
            {title && (
              <h2
                className='
                dark text-foreground font-semibold ml-4
                text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 
                2xl:text-4xl 4xl:text-5xl 5xl:text-6xl
              '
              >
                {title}
              </h2>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              className='
                dark flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 
                transition-colors duration-200 group
                w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 
                xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 4xl:w-16 4xl:h-16 5xl:w-18 5xl:h-18
              '
              aria-label='Close modal'
            >
              <IconX
                className='
                  text-foreground group-hover:scale-110 transition-transform
                  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 
                  xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 4xl:w-12 4xl:h-12 5xl:w-14 5xl:h-14
                '
              />
            </button>
          </div>

          {/* Content Area */}
          <div
            className='
            dark flex-1 p-4 overflow-y-auto h-full
            p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 4xl:p-10 5xl:p-12
          '
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default BottomUpModal;
