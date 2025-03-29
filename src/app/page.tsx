'use client';

import Footer from '@/components/layout/sections/footer/footer';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // submit logic
    console.log({ email, password, rememberMe });
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

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label htmlFor='email' className='block text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='minimal-input'
              placeholder='your@email.com'
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='minimal-input'
              placeholder='Your Password'
            />
          </div>

          <div className='flex items-center'>
            <input
              id='remember-me'
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-zinc-400'
            >
              Remember me
            </label>
          </div>

          <div>
            <button
              type='submit'
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Sign in
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
            className='gray-button-minimal col-span-2'
            onClick={() => console.log('Google login')}
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
