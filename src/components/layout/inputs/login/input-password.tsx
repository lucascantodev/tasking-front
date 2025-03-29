import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';

export interface LoginPasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: FieldError;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}

const LoginPasswordInput = forwardRef<
  HTMLInputElement,
  LoginPasswordInputProps
>(
  (
    {
      label,
      helperText,
      error,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      helperTextClassName,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label
            htmlFor={props.id || 'password'}
            className={cn(
              'block text-sm font-medium text-zinc-700 dark:text-zinc-300',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className={cn('relative', className)}>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            id={props.id || 'password'}
            className={cn(
              'w-full px-4 py-2 pr-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition duration-200',
              error && 'border-red-500 focus:ring-red-500',
              inputClassName
            )}
            {...props}
          />

          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 focus:outline-none'
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            className={cn(
              'flex items-center mt-1 text-red-500 text-sm',
              errorClassName
            )}
          >
            <AlertCircle size={14} className='mr-1' />
            <span>{error.message}</span>
          </div>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            className={cn(
              'text-xs text-zinc-500 dark:text-zinc-400 mt-1',
              helperTextClassName
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

LoginPasswordInput.displayName = 'LoginPasswordInput';

export default LoginPasswordInput;
