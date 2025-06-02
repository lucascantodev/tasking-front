import Link from 'next/link';

import { cn } from '@/lib/utils';
import DefaultProps, { RouteProps } from '@/types/props';
import { LinkProps } from 'next/link';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <nav className={cn('flex', className)} {...props}>
      {children}
    </nav>
  );
}

export function Route({
  href,
  target = '_self',
  className,
  children,
  ...props
}: RouteProps) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        `flex justify-center items-center gap-[8px] rounded-[5px] p-[3px] border-[1px] border-foreground`,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
