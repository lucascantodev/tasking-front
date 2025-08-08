import {
  IconZzz,
  IconTilde,
  IconAlertTriangleFilled,
} from '@tabler/icons-react';
import { Priority } from '@/schemas/priority';
import { cn } from '@/lib/utils';

export function TaskPriority({ priority }: { priority: Priority }) {
  const iconsStyle =
    'w-3.5 h-3.5 2xl:w-5 2xl:h-5 4xl:h-6.5 4xl:w-6.5 5xl:h-7 5xl:w-7';
  const priorityStats: { [key: string]: any } = {
    low: {
      color: 'border-lime-500 ',
      text: 'Low',
      icon: <IconZzz className={iconsStyle} />,
    },
    medium: {
      color: 'border-amber-500',
      text: 'Medium',
      icon: <IconTilde className={iconsStyle} />,
    },
    high: {
      color: 'border-red-500',
      text: 'High',
      icon: (
        <IconAlertTriangleFilled
          strokeLinecap='square'
          strokeLinejoin='bevel'
          className={iconsStyle}
        />
      ),
    },
  };

  return (
    <span
      className={cn(
        `
        dark flex items-center space-x-1 2xl:space-x-2 4xl:space-x-3 
        px-1 xl:px-3 py-0.5 lg:py-1 xl:py-1.5 
        text-xs lg:text-base xl:text-lg 2xl:text-xl 
        4xl:text-2xl 5xl:3xl font-medium 
        rounded-lg sm:rounded-xl lg:rounded-2xl border 
        text-foreground flex-shrink-0
        `,
        priorityStats[priority.toLowerCase()].color
      )}
    >
      {priorityStats[priority.toLowerCase()].icon}
      <span className='inline'>
        {priorityStats[priority.toLowerCase()].text}
      </span>
    </span>
  );
}
