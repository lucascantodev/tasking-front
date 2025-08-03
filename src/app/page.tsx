'use client';

import Footer from '@/components/layout/sections/footer/footer';
import Image from 'next/image';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Login_Type } from '@/dto/login';
import signInSchema, { SignISchema_Type } from '@/schemas/signIn';

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignISchema_Type>({
    defaultValues: {
      email: 'johndoe@gmail.com',
      password: '123456',
    },
    resolver: zodResolver(signInSchema),
    mode: 'onChange', // Validates on change for better UX
  });

  const onSubmit = async (data: SignISchema_Type): Promise<void> => {
    setError('');

    try {
      await login({
        email: data.email,
        password: data.password,
      });

      console.log('✅ Login successful!');
      console.log('⏩Redirecting to workspaces...');
      router.push('/workspaces');
    } catch (error) {
      console.error('🚩Login failed!', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to login. Please try again.'
      );
    }
  };

  return (
    <div className='grid min-h-screen bg-zinc-900 text-zinc-100 p-4'>
      <div className='flex flex-col max-w-md w-full mx-auto my-auto p-8 bg-zinc-800 rounded-xl shadow-lg'>
        <div className='flex flex-col items-center justify-center mb-8'>
          <h1 className='text-4xl font-bold'>TASKING</h1>
          <p className='text-2xl mt-4 animate-fadeIn'>
            Prioritize your world with tasks
          </p>
        </div>

        <div className='text-center mb-8'>
          <p className='text-zinc-400'>Sign in to your account</p>
        </div>

        {error && (
          <div className='mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='email' className='block text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              {...register('email')}
              autoComplete='email'
              className={`
                appearance-none relative block w-full px-3 py-2 bg-white border 
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none 
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }
              `}
              placeholder='Email address'
            />
            {errors.email && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label htmlFor='password' className='block text-sm font-medium'>
                Password
              </label>
              <a href='#' className='text-sm text-blue-400 hover:text-blue-300'>
                Forgot password?
              </a>
            </div>
            <input
              id='password'
              type='password'
              {...register('password')}
              autoComplete='current-password'
              className={`
                appearance-none relative block w-full px-3 py-2 bg-white border 
                placeholder-gray-500 text-gray-900 rounded-md focus:outline-none 
                focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }
              `}
              placeholder='Password'
            />
            {errors.password && (
              <p className='text-red-400 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className='flex items-center my-6'>
          <div className='flex-grow border-t border-zinc-600'></div>
          <span className='flex-shrink mx-4 text-zinc-400 text-sm'>Or</span>
          <div className='flex-grow border-t border-zinc-600'></div>
        </div>

        <div className='grid grid-cols-2'>
          <button
            type='button'
            disabled={isSubmitting}
            className='gray-button-minimal col-span-2'
            onClick={() => console.log('🚩🚩Google login')}
          >
            <FaGoogle />
            <span className='text-sm'>Google</span>
          </button>
        </div>

        <p className='mt-8 text-center text-sm text-zinc-400'>
          Don't have an account?{' '}
          <a href='#' className='link-minimal'>
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}
