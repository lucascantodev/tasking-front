import { IconPlus } from '@tabler/icons-react';

import Header from '@/components/layout/sections/header/header';
import CreateNewSection from '@/components/layout/sections/main/createNewSection';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <CreateNewSection
        href='/'
        labelText='Create a new Workspace!'
        buttonText={[
          <span key={1} className='font-[700] text-[1rem]'>
            Add a Workspace
          </span>,
          <IconPlus key={2} className='size-[1.5rem]' />,
        ]}
      />
      {children}
    </>
  );
}
