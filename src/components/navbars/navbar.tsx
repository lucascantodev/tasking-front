'use client';

import Link from 'next/link';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import DefaultProps, { RouteProps } from '@/dto/props';

export function Root({ className, children, ...props }: DefaultProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {/* desktop nav: visible from sm and up */}
      <nav className={cn('hidden sm:flex', className)} {...props}>
        {children}
      </nav>

      {/* mobile burger menu: visible below sm */}
      <div className='flex sm:hidden items-center'>
        {/* burger button */}
        <button
          aria-label='Open menu'
          className='dark bg-background border border-foreground rounded p-2 flex flex-col justify-center items-center gap-1'
          onClick={() => setOpen((v) => !v)}
        >
          <span className='block w-6 h-0.5 bg-foreground rounded' />
          <span className='block w-6 h-0.5 bg-foreground rounded' />
          <span className='block w-6 h-0.5 bg-foreground rounded' />
        </button>

        {/* side menu */}
        <div
          className={cn(
            `fixed top-0 right-0 h-full w-[75%] z-50 dark bg-background border-l border-foreground py-5 px-7
            flex flex-col items-center justify-start transition-transform duration-300 animate-in`,
            open
              ? 'translate-x-0 slide-in-from-right'
              : 'translate-x-full pointer-events-none opacity-0'
          )}
        >
          {/* close button */}
          <div className='w-full flex justify-end px-4 pt-4'>
            <button
              aria-label='Close menu'
              className='text-foreground text-2xl'
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          {/* links */}
          <div className='flex flex-col items-center gap-6 mt-8 w-full'>
            {/* adjusting children styles */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                // more specific type assertion
                const childElement = child as React.ReactElement<{
                  className?: string;
                  [key: string]: any;
                }>;

                return React.cloneElement(childElement, {
                  ...childElement.props,
                  className: cn(
                    'dark text-foreground w-full justify-center items-center border-0 hover:bg-secondary',
                    childElement.props.className
                  ),
                });
              }
              return child;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function Route({
  href,
  target = '_self',
  className,
  children,
  ...props
}: RouteProps) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        `
          flex justify-center items-center gap-[8px] rounded-[5px] p-[3px] border-[1px] border-foreground
          xl:text-[1.25rem] xl:p-[0.3125rem] 2xl:text-[1.5rem] 2xl:p-[0.5rem] 2xl:border-[2px]
          4xl:text-[1.75rem] 4xl:p-[0.625rem] 4xl:rounded-[7px] 4xl:gap-[10px] 5xl:text-[2rem] 5xl:p-[0.75rem]
        `,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
