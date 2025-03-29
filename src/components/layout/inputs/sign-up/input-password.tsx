import React, { useState, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FieldError } from 'react-hook-form';

interface PasswordPreviewProps {
  placeholder?: string;
  label?: string;
  control?: any;
  name?: string;
  error?: FieldError;
  className?: string;
}

const PasswordPreview = ({
  placeholder = '',
  label = '',
  control,
  name,
  error,
  className,
}: PasswordPreviewProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setHasError(e.target.value.length < 6 && e.target.value.length > 0);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <div className='flex flex-col items-center w-full max-w-lg mx-auto bg-white rounded-lg'>
      <div className='w-full space-y-4 relative'>
        <div className='w-full'>
          <label
            htmlFor='password'
            className='flex items-center gap-1 text-sm font-medium mb-1'
          >
            {label}
            <span className='text-red-500'>*</span>
          </label>

          <div className='relative'>
            <Input
              id='password'
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              className='w-full h-10 px-3 border border-gray-500 rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={hasError ? 'true' : 'false'}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none'
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking the eye icon
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {hasError && (
            <span className='text-red-500 text-xs mt-1 block'>
              A senha deve ter pelo menos 6 caracteres
            </span>
          )}

          {error && (
            <span className='text-red-500 text-xs mt-1 block'>
              {error.message}
            </span>
          )}
        </div>

        {/* Floating Password Strength Panel */}
        <div
          className={`absolute left-0 right-0 z-50 transition-all duration-300 overflow-hidden rounded-lg shadow-lg border border-gray-200 
                    ${
                      isInputFocused
                        ? 'max-h-60 opacity-100 scale-100 transform-origin-top'
                        : 'max-h-0 opacity-0 scale-95 transform-origin-top'
                    }`}
        >
          <div className='bg-white p-3 rounded-t-lg'>
            <div className='flex justify-between text-sm mb-1 font-medium'>
              <span>Força da senha:</span>
              <span
                className={
                  password.length > 8
                    ? 'text-green-600 font-semibold'
                    : password.length > 0
                      ? 'text-yellow-600 font-semibold'
                      : 'text-gray-400'
                }
              >
                {password.length > 8
                  ? 'Forte'
                  : password.length > 0
                    ? 'Média'
                    : 'Vazia'}
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  password.length > 8
                    ? 'bg-green-500'
                    : password.length > 0
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                }`}
                style={{ width: `${Math.min(100, password.length * 12.5)}%` }}
              ></div>
            </div>
          </div>

          <div className='w-full p-3 bg-gray-50 rounded-b-lg'>
            <div className='text-sm text-gray-700'>
              <p className='mb-2 font-medium'>Sua senha deve ter:</p>
              <ul className='space-y-2'>
                <li
                  className={`flex items-center gap-2 ${
                    password.length >= 6 ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {password.length >= 6 ? (
                    <div className='rounded-full bg-green-100 text-green-600 h-5 w-5 flex items-center justify-center border border-green-200'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className='rounded-full bg-gray-100 h-5 w-5 flex items-center justify-center border border-gray-300'></div>
                  )}
                  <span className={password.length >= 6 ? 'font-medium' : ''}>
                    Pelo menos 6 caracteres
                  </span>
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {/[A-Z]/.test(password) ? (
                    <div className='rounded-full bg-green-100 text-green-600 h-5 w-5 flex items-center justify-center border border-green-200'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className='rounded-full bg-gray-100 h-5 w-5 flex items-center justify-center border border-gray-300'></div>
                  )}
                  <span className={/[A-Z]/.test(password) ? 'font-medium' : ''}>
                    Uma letra maiúscula
                  </span>
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    /[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {/[0-9]/.test(password) ? (
                    <div className='rounded-full bg-green-100 text-green-600 h-5 w-5 flex items-center justify-center border border-green-200'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-3 w-3'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className='rounded-full bg-gray-100 h-5 w-5 flex items-center justify-center border border-gray-300'></div>
                  )}
                  <span className={/[0-9]/.test(password) ? 'font-medium' : ''}>
                    Um número
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordPreview;
