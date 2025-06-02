import { IconLayoutDashboard } from '@tabler/icons-react';

import Logo from '@/components/tasking/logo';
import * as NavBar from '@/components/navbars/navbar';


export default function Header() {
  return (
    <header className='dark w-full flex justify-between items-center p-[1.25em] px-[2.5em] border-b-[1px] bg-background text-foreground'>
      <Logo />
      <NavBar.Root>
        <NavBar.Route href='/workspaces'>
          <IconLayoutDashboard stroke={1.5} className='size-[1.5rem]' />
          Workspace
        </NavBar.Route>
      </NavBar.Root>
    </header>
  );
}
