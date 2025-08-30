'use client';

import DefaultProps from '@/dto/props';
import { Task } from '@/dto/task';
import { cn } from '@/lib/utils';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { TaskPriority } from '@/components/badges/taskPriority';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void; // func to edit button
  onDelete: (task: Task) => void; // func to delete button
  onCheck: (task: Task) => void; // func to check task
  setCurrentTask: (task: Task) => void; // func to on select task
}

export function Root({ className, children, ...props }: DefaultProps) {
  return (
    <div
      className={cn(
        `
        w-full
        md:w-9/20 md:max-w-[55%]
        lg:w-2/5 lg:max-w-[40%]
        xl:w-1/3 xl:max-w-[33.333%]
        2xl:w-2/5 2xl:max-w-[40%]
        h-full overflow-y-auto
        mr-0`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TableRoot({ className, children, ...props }: DefaultProps) {
  return (
    <table className={cn('table-auto w-full', className)} {...props}>
      <tbody>{children}</tbody>
    </table>
  );
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onCheck,
  setCurrentTask,
}: TaskItemProps) {
  return (
    <tr
      className='
        dark w-full flex items-center justify-between space-x-2 xs:space-x-3 
        md:space-x-1 lg:space-x-3 2xl:space-x-4.5 rounded-xl 
        sm:rounded-2xl lg:rounded-3xl p-2 sm:p-3 md:p-2 lg:p-3  
        2xl:p-4 hover:bg-muted/50 transition-all duration-200
    '
      onClick={(e) => setCurrentTask(task)}
    >
      <td className='flex-shrink-0 p-1'>
        <input
          type='checkbox'
          className='
            h-3 w-3 s:h-4 s:w-4 md:h-3 md:w-3 lg:h-5 lg:w-5 2xl:h-7 2xl:w-7 4xl:h-9 4xl:w-9 
            5xl:h-11 5xl:w-11 rounded transition-all
          '
          checked={task.isComplete}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onCheck(task);
          }}
        />
      </td>

      <td
        className='
        flex items-center space-x-1 sm:space-x-2 md:space-x-1 lg:space-x-2.5 xl:space-x-3 
        2xl:space-x-4.5 
    '
      >
        <span
          className='
            dark text-xs sm:text-sm md:text-xs lg:text-lg xl:text-xl 
            2xl:text-2xl 4xl:text-4xl 5xl:text-5xl font-medium lg:font-semibold text-foreground truncate 
        '
        >
          {task.name.slice(0, 11)}
        </span>
        <TaskPriority priority={task.priority} />
      </td>

      <td
        className='
            flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0
        '
      >
        <button
          className='
            dark p-1 sm:p-1.5 md:p-1 lg:p-2.5 2xl:p-3.5 4xl:p-5 5xl:p-6.5 rounded-lg 
            sm:rounded-xl lg:rounded-2xl hover:bg-muted transition-colors text-foreground
            group
            '
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <IconEdit
            className='
                w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 
                4xl:w-10 4xl:h-10 5xl:w-12 5xl:h-12 group-hover:scale-110 transition-transform
            '
          />
        </button>

        <button
          className='
            dark p-1 sm:p-1.5 md:p-1 lg:p-2.5 2xl:p-3.5 4xl:p-5 5xl:p-6.5 rounded-lg 
            sm:rounded-xl lg:rounded-2xl hover:bg-muted transition-colors text-red-500
            group
            '
        >
          <IconTrash
            className='
                w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 
                4xl:w-10 4xl:h-10 5xl:w-12 5xl:h-12 group-hover:scale-110 transition-transform
            '
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
          />
        </button>
      </td>
    </tr>
  );
}
