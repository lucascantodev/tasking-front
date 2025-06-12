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
import DefaultProps, { ButtonProps } from '@/types/props';
import { Priority, Status } from '@/schemas/Workspace';
import { Badge } from '@/components/ui/badge';
import { Button as ShadButton } from '@/components/ui/button';

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
            dark min-w-2xs bg-background border-[1px] rounded-[5px] border-foreground px-[1.1875rem] py-[1.6875rem]
            flex flex-col justify-between gap-12
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
      className={cn('dark flex flex-col gap-6 items-start', className)}
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
      className={cn('dark text-foreground text-2xl font-normal', className)}
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
    <p className={cn('dark text-foreground text-md font-normal')} {...props}>
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
    <div className={cn('flex gap-2.5', className)} {...props}>
      {children}
    </div>
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
      low: <IconZzz color='#FAFAFA' size={28} />,
      medium: <IconTilde color='#FAFAFA' size={28} />,
      high: (
        <IconAlertTriangleFilled
          color='#FAFAFA'
          size={28}
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
        'dark bg-background border border-foreground p-1 flex gap-0.5 rounded-[0px]',
        className
      )}
      {...props}
    >
      {getPriorityIcon(priority)}
      <span className='dark text-foreground text-[0.875rem] font-normal'>
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
      'not-started': <IconCalendarFilled color='#FAFAFA' size={20} />,
      'in-progress': <IconBoltFilled color='#FAFAFA' size={20} />,
      completed: <IconCheckbox color='#FAFAFA' size={20} />,
      waiting: <IconClockHour2Filled color='#FAFAFA' size={20} />,
    };

    return icons[status];
  };

  return (
    <Badge
      className={cn(
        'dark bg-background border border-foreground p-1 flex gap-0.5 rounded-[0px]',
        className
      )}
      {...props}
    >
      {getStatusIcon(status)}
      <span className='dark text-foreground text-[0.875rem] font-normal'>
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
    <div className={cn('flex justify-end gap-2', className)} {...props}>
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
    <ShadButton
      onClick={onClick}
      className={cn(
        'dark flex gap-0.5 border border-foreground bg-background hover:bg-secondary hover:cursor-pointer px-1 py-0.5 rounded-[0px]',
        className
      )}
      {...props}
    >
      {children}
    </ShadButton>
  );
}
