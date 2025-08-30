'use client';

import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Login_Type } from '@/dto/login';
import signInSchema, { SignISchema_Type } from '@/schemas/signIn';
import TaskingLogo from '@/components/tasking/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      console.log('⏩Redirecting to lists...');
      router.push('/lists');
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
    <div className='min-h-screen bg-black text-white flex'>
      {/* Left side - Logo and tagline */}
      <div className='hidden lg:flex lg:flex-1 flex-col items-center justify-center bg-black px-8'>
        <div className='text-center'>
          <TaskingLogo className='text-white mb-6' />
          <p className='text-zinc-300 text-lg max-w-sm'>
            Prioritize your world with tasks
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className='flex-1 lg:max-w-md xl:max-w-lg 2xl:max-w-xl flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-sm space-y-8'>
          {/* Mobile logo */}
          <div className='lg:hidden text-center mb-8'>
            <TaskingLogo className='text-white mb-4' />
            <p className='text-zinc-300 text-sm'>
              Prioritize your world with tasks
            </p>
          </div>

          <div>
            <h2 className='text-3xl font-bold text-white'>Login</h2>
          </div>

          {error && (
            <div className='mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Input
                id='email'
                type='email'
                {...register('email')}
                autoComplete='email'
                placeholder='Username'
                className={`
                  bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400
                  focus:border-zinc-500 focus:ring-zinc-500/20
                  ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }
                `}
              />
              {errors.email && (
                <p className='text-red-400 text-sm mt-1'>
                  {errors.email.message}
                </p>
              )}
          </div>

            <div className='space-y-2'>
              <Input
                id='password'
                type='password'
                {...register('password')}
                autoComplete='current-password'
                placeholder='Password'
                className={`
                  bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400
                  focus:border-zinc-500 focus:ring-zinc-500/20
                  ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : ''
                  }
                `}
              />
              {errors.password && (
                <p className='text-red-400 text-sm mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600'
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className='text-center'>
              <a href='/join' className='text-sm text-zinc-400 hover:text-zinc-300'>
                Register
              </a>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
