'use client';

import { IconLayoutDashboard, IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

import Logo from '@/components/tasking/logo';
import * as NavBar from '@/components/navbars/navbar';

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      className='
        dark w-full flex justify-between items-center px-[1.2rem] py-[1rem] s:px-[1.5rem] s:py-[1.2rem] 
        sm:px-[1.8rem] sm:py-[1.4rem] lg:px-[2rem] lg:py-[1.8rem] xl:px-[2.2rem] xl:py-[2rem] 
        2xl:px-[2.5rem] 2xl:py-[2.2rem] 4xl:px-[2.8rem] 4xl:py-[2.6rem] 5xl:px-[3.2rem] 5xl:py-[3.1rem] 
        border-b-[1px] 2xl:border-b-[3px] bg-background text-foreground
      '
    >
      <Logo href='/workspaces' />
      <div className='flex items-center gap-4'>
        <button
          onClick={handleLogout}
          className='
            flex items-center gap-2 px-3 py-2 rounded-md
            hover:bg-red-600/10 text-red-400 hover:text-red-300
            transition-colors duration-200
            border border-red-400/20 hover:border-red-400/40
            cursor-pointer
          '
          title='Logout'
        >
          <IconLogout stroke={1.5} className='size-[1.2em]' />
          <span className='hidden sm:inline'>Logout</span>
        </button>
      </div>
    </header>
  );
}
