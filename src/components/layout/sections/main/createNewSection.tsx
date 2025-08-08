import { cn } from '@/lib/utils';
import DefaultProps, { ButtonProps } from '@/dto/props';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
          dark w-full bg-background text-foreground 
          py-4 px-4 
          sm:py-5 sm:px-6 
          md:py-6 md:px-8 
          lg:py-8 lg:px-10
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Container({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
          flex gap-3 items-center 
          flex-col
          sm:flex-row sm:gap-4
          md:gap-5
          lg:gap-6
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Label({ className, children, ...props }: DefaultProps) {
  return (
    <span
      className={cn(
        `
          text-sm 
          sm:text-base 
          md:text-lg
          lg:text-xl
          2xl:text-2xl
          4xl:text-3xl
          5xl:text-4xl
          font-medium
        `,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        `
          flex justify-center items-center gap-1 
          rounded-lg border border-foreground
          py-2 px-3
          sm:py-2 sm:px-4
          md:py-3 md:px-5
          lg:py-3 lg:px-6
          font-bold 
          text-xs 
          sm:text-sm 
          md:text-base
          w-full
          sm:w-auto
          transition-colors duration-200
          hover:bg-foreground hover:text-background
          focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 
          cursor-pointer
        `,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
