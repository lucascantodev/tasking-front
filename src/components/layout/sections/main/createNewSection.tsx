import Link from 'next/link';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import DefaultProps, { RouteProps } from '@/types/props';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
          dark w-full bg-background text-foreground py-[1.375rem] px-[1.125rem] s:py-[1.5rem] s:px-[1.25rem]
          lg:py-[1.75rem] lg:px-[1.5rem] 2xl:py-[2.125rem] 2xl:px-[1.875rem] 4xl:py-[2.5rem] 4xl:px-[2.25rem]
          5xl:py-[2.875rem] 5xl:px-[2.625rem]
          md:text-[1.125rem] lg:text-[1.75rem] 2xl:text-[2.125rem] 4xl:text-[2.5rem] 5xl:text-[2.875rem]
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Container({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        'flex gap-[1.25rem] 2xl:gap-[1.5rem] 4xl:gap-[2rem] items-center'
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Label({ className, children, ...props }: DefaultProps) {
  return (
    <span className={cn('text-[1em]', className)} {...props}>
      {children}
    </span>
  );
}

export function Button({
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
        `
          flex justify-center items-center gap-[4px] grow-0 rounded-[8px] border-[1px] 2xl:border-[2px] border-foreground
          py-[0.25rem] px-[0.5rem] font-700 text-[0.75em] 
        `,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export default function ({
  href,
  labelText,
  buttonText,
}: Readonly<{
  href: string;
  labelText: ReactNode | ReactNode[];
  buttonText: ReactNode | ReactNode[];
}>) {
  return (
    <Root>
      <Container>
        <Label>{labelText}</Label>
        <Button href={href}>{buttonText}</Button>
      </Container>
    </Root>
  );
}
