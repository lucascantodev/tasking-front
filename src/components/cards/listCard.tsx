import {
  IconZzz,
  IconTilde,
  IconAlertTriangleFilled,
  IconCalendarFilled,
  IconBoltFilled,
  IconCheckbox,
  IconClockHour2Filled,
} from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import DefaultProps, { ButtonProps } from '@/dto/props';
import { Priority } from '@/schemas/priority';
import { Status } from '@/schemas/status';
import { Badge as ShadBadge } from '@/components/ui/badge';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
            dark min-w-2xs 2xl:min-h-[18rem] 4xl:min-h-[24rem] 5xl:min-h-[30rem] 
            bg-background border-[1px] 4xl:border-[2px] rounded-[5px] border-foreground 
            px-[1.1875rem] py-[1.6875rem] 2xl:px-[1.5rem] 2xl:py-[2rem] flex flex-col justify-between gap-12
        `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardInfos({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        'dark flex flex-col gap-5 2xl:gap-5.5 4xl:gap-6 5xl:gap-7 items-start',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Title({
  title,
  className,
  ...props
}: Omit<DefaultProps, 'children'> & { title: string }) {
  return (
    <h3
      className={cn(
        'dark text-foreground text-2xl 2xl:text-3xl 4xl:text-5xl 5xl:text-6xl font-normal',
        className
      )}
      {...props}
    >
      {title}
    </h3>
  );
}

export function Description({
  text,
  className,
  ...props
}: Omit<DefaultProps, 'children'> & { text: string }) {
  return (
    <p
      className={cn(
        'dark text-foreground text-sm xl:text-lg 2xl:text-xl 4xl:text-2xl 5xl:text-3xl font-normal'
      )}
      {...props}
    >
      {text}
    </p>
  );
}

export function BadgesContainer({
  children,
  className,
  ...props
}: DefaultProps) {
  return (
    <div
      className={cn('flex gap-2.5 2xl:gap-3 4xl:gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, className, ...props }: DefaultProps) {
  return (
    <ShadBadge
      className={cn(
        `
          dark bg-background border 4xl:border-[2px] border-foreground p-1 xl:p-2 4xl:p-3 flex 
          gap-0.5 xl:gap-1 2xl:gap-2 rounded-[0px] 
          text-foreground text-[0.875rem] xl:text-[1.125rem] 2xl:text-[1.25rem] 
          4xl:text-[1.75rem] 5xl:text-[2rem] font-normal
        `,
        className
      )}
      {...props}
    >
      {children}
    </ShadBadge>
  );
}

export function PriorityBadge({
  priority,
  className,
  ...props
}: Omit<DefaultProps, 'children'> & { priority: Priority }) {
  const capitalizedPriority =
    priority.charAt(0).toUpperCase() + priority.slice(1);

  const getPriorityIcon = (priority: Priority) => {
    const icons = {
      low: <IconZzz color='#FAFAFA' />,
      medium: <IconTilde color='#FAFAFA' />,
      high: (
        <IconAlertTriangleFilled
          color='#FAFAFA'
          strokeLinecap='square'
          strokeLinejoin='bevel'
        />
      ),
    };

    return icons[priority];
  };

  return (
    <Badge
      className={cn(
        `
          dark bg-background border 4xl:border-[2px] border-foreground p-1 xl:p-2 4xl:p-3 flex 
          gap-0.5 xl:gap-1 2xl:gap-2 rounded-[0px] 
          text-foreground text-[0.875rem] xl:text-[1.125rem] 2xl:text-[1.25rem] 
          4xl:text-[1.75rem] 5xl:text-[2rem] font-normal
        `,
        className
      )}
      {...props}
    >
      {getPriorityIcon(priority)}
      <span
        className='
          dark 
        '
      >
        {capitalizedPriority}
      </span>
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
  ...props
}: Omit<DefaultProps, 'children'> & { status: Status }) {
  // Formata Status, retirando '-' e capitalizando cada palavra
  const formattedStatus = status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const getStatusIcon = (status: Status) => {
    const icons = {
      'not-started': <IconCalendarFilled color='#FAFAFA' />,
      'in-progress': <IconBoltFilled color='#FAFAFA' />,
      completed: <IconCheckbox color='#FAFAFA' />,
      waiting: <IconClockHour2Filled color='#FAFAFA' />,
    };

    return icons[status];
  };

  return (
    <Badge
      className={cn(
        `
          dark bg-background border 4xl:border-[2px] border-foreground p-1 xl:p-2 4xl:p-3 flex 
          gap-0.5 xl:gap-1 2xl:gap-2 rounded-[0px] 
          text-foreground text-[0.875rem] xl:text-[1.125rem] 2xl:text-[1.25rem] 
          4xl:text-[1.75rem] 5xl:text-[2rem] font-normal
        `,
        className
      )}
      {...props}
    >
      {getStatusIcon(status)}
      <span
        className='
          dark
        '
      >
        {formattedStatus}
      </span>
    </Badge>
  );
}

export function ButtonsContainer({
  children,
  className,
  ...props
}: DefaultProps) {
  return (
    <div
      className={cn(
        'flex justify-end gap-2 lg:gap-3 xl:gap-4 2xl:gap-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  onClick,
  children,
  className,
  ...props
}: ButtonProps) {
  /**
   * Empty base button. Fill it with content.
   */

  return (
    <button
      onClick={onClick}
      className={cn(
        `dark flex gap-0.5 2xl:gap-1 4xl:gap-2 border 4xl:border-[2px] border-foreground bg-background 
        hover:bg-secondary hover:cursor-pointer 
        px-1 xl:px-2 2xl:px-3 4xl:px-4 5xl:px-5 py-0.5 xl:py-1 2xl:py-2 4xl:py-3 5xl:py-4 rounded-[0px] 
        text-xl xl:text-2xl 2xl:text-3xl 4xl:text-4xl 5xl:text-5xl`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
