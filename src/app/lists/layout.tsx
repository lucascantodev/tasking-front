import Header from '@/components/layout/sections/header/header';
import { AuthProvider } from '@/contexts/auth-context';
import { ListProvider } from '@/contexts/list-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
