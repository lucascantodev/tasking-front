import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@styles/globals.css';
import Footer from '@/components/layout/sections/footer/footer';
import { AuthProvider } from '@/contexts/auth-context';
import { AuthErrorProvider } from '@/contexts/authError-context';
import { ListProvider } from '@/contexts/list-context';
import { TasksProvider } from '@/contexts/tasks-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tasking',
  description: 'Prioritize your world with tasks',
  abstract: '',
  // authors: [{ name: "Task Guys", url: "ADD FUTURE URL" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' style={{ height: '100%' }}>
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a]`}
      >
        <AuthProvider>
          <AuthErrorProvider>
            <ListProvider>
              <TasksProvider>{children}</TasksProvider>
            </ListProvider>
          </AuthErrorProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
