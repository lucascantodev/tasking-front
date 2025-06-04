import { cn } from '@/lib/utils';

export default function TaskingLogo({
  className,
  ...props
}: Readonly<{ className?: string; props?: any[] }>) {
  return (
    <h1 className={cn('text-[2.875rem]', className)} {...props}>
      TASKING
    </h1>
  );
}
