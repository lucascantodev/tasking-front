import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TaskingLogo({
  className,
  href = '/',
  ...props
}: Readonly<{ className?: string; props?: any[]; href?: string }>) {
  return (
    <Link
      className={cn(
        `text-[1.25rem] s:text-[1.7rem] sm:text-[2rem] lg:text-[2.5rem] xl:text-[2.7rem] 
      2xl:text-[3.3rem] 4xl:text-[4rem] 5xl:text-[4.5rem] font-medium`,
        className
      )}
      href={href}
      {...props}
    >
      TASKING
    </Link>
  );
}
