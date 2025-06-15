import { IconLayoutDashboard } from '@tabler/icons-react';

import Logo from '@/components/tasking/logo';
import * as NavBar from '@/components/navbars/navbar';

export default function Header() {
  return (
    <header
      className='
        dark w-full flex justify-between items-center px-[1.2rem] py-[1rem] s:px-[1.5rem] s:py-[1.2rem] 
        sm:px-[1.8rem] sm:py-[1.4rem] lg:px-[2rem] lg:py-[1.8rem] xl:px-[2.2rem] xl:py-[2rem] 
        2xl:px-[2.5rem] 2xl:py-[2.2rem] 4xl:px-[2.8rem] 4xl:py-[2.6rem] 5xl:px-[3.2rem] 5xl:py-[3.1rem] 
        border-b-[1px] 2xl:border-b-[3px] bg-background text-foreground
      '
    >
      <Logo />
      <NavBar.Root>
        <NavBar.Route href='/workspaces'>
          <IconLayoutDashboard stroke={1.5} className='size-[1.2em]' />
          Workspace
        </NavBar.Route>
      </NavBar.Root>
    </header>
  );
}
