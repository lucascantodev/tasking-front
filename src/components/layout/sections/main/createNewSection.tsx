import { cn } from '@/lib/utils';
import DefaultProps, { RouteProps } from '@/types/props';
import { Route } from '@/components/navbars/navbar';
import { ReactNode } from 'react';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        'dark w-full bg-background text-foreground py-[3.4375rem] px-[2.5rem]',
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
    <div className={cn('flex gap-[1.25rem]')} {...props}>
      {children}
    </div>
  );
}

export function Label({ className, children, ...props }: DefaultProps) {
  return (
    <span className={cn('text-[1.875rem]', className)} {...props}>
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
    <Route
      href={href}
      target={target}
      className={cn('rounded-[8px] py-2 px-4', className)}
      {...props}
    >
      {children}
    </Route>
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
