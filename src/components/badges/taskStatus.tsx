import {
  IconZzz,
  IconTilde,
  IconAlertTriangleFilled,
  IconCalendarFilled,
  IconBoltFilled,
  IconCheckbox,
  IconClockHour2Filled,
} from '@tabler/icons-react';
import { Status } from '@/schemas/status';
import { cn } from '@/lib/utils';

export function TaskStatus({ status }: { status: Status }) {
  const iconsStyle =
    'w-3.5 h-3.5 2xl:w-5 2xl:h-5 4xl:h-6.5 4xl:w-6.5 5xl:h-7 5xl:w-7';
  const statusStats: { [key: string]: any } = {
    'not-started': {
      color: 'border-gray-400 ',
      text: 'not-started',
      icon: <IconCalendarFilled className={iconsStyle} />,
    },
    'in-progress': {
      color: 'border-sky-400',
      text: 'in-progress',
      icon: <IconBoltFilled className={iconsStyle} />,
    },
    completed: {
      color: 'border-lime-400',
      text: 'completed',
      icon: <IconCheckbox className={iconsStyle} />,
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
        statusStats[status.toLowerCase()].color
      )}
    >
      {statusStats[status.toLowerCase()].icon}
      <span className='inline'>{statusStats[status.toLowerCase()].text}</span>
    </span>
  );
}
