'use client';

import {
  IconExclamationCircle,
  IconLoader,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';

import { Task } from '@/dto/task';
import * as CreateSec from '@components/layout/sections/main/createNewSection';
import * as TaskList from '@components/layout/listviews/tasksListView';
import { useList } from '@/contexts/list-context';
import { useTasks } from '@/contexts/tasks-context';

export default function TasksPage() {
  const { currentList } = useList();
  const { tasks, isLoading, error, getTasksByListId, refreshTasks } =
    useTasks();

  console.log('currentList value: ', currentList);

  const handleRetry = () => {
    refreshTasks();
  };

  if (isLoading) {
    return (
      <div className='flex flex-col justify-center items-center h-64 space-y-4'>
        <IconLoader className='animate-spin text-blue-500' size={40} />
        <p className='text-gray-600'>Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col justify-center items-center h-64 space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <IconExclamationCircle className='text-red-500' size={48} />
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              Failed to load tasks
            </h3>
            <p className='text-gray-600 max-w-md'>
              {error ||
                'Something went wrong while loading your tasks. Please try again.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className='
            flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 transition-colors duration-200
          '
        >
          <IconRefresh size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const listTasks = getTasksByListId(currentList!.id);

  return (
    <main className='h-full'>
      {/* START - Create a new section */}
      <CreateSec.Root>
        <CreateSec.Container>
          <CreateSec.Label>Create a new Task!</CreateSec.Label>
          <CreateSec.Button>
            <span className='font-bold text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl 4xl:text-3xl 5xl:text-4xl'>
              Add a Task
            </span>
            <IconPlus className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 5xl:w-16 5xl:h-16' />
          </CreateSec.Button>
        </CreateSec.Container>
      </CreateSec.Root>
      {/* END - Create a new section */}

      <section className='w-full h-[80%] min-h-[90%] mb-4 border-y-1 border-white'>
        <div className='w-full h-full min-h-full flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-4'>
          {/* ── Left: tasks list ─────────────────────────────────────────────────────────── */}
          <TaskList.Root>
            <TaskList.TableRoot>
              {listTasks!.map((v, i) => {
                // Limit display name length to 12 chars in tasks listview
                const taskname = v.name.slice(0, 11);
                const task = v;
                task.name = taskname;

                return (
                  <TaskList.TaskItem
                    key={i}
                    task={v}
                    onEdit={(task) => {
                      console.log('Task Edited');
                      return true;
                    }}
                    onDelete={(task) => {
                      console.log('Task Deleted');
                      return true;
                    }}
                    onCheck={(task) => {
                      task.isComplete = !task.isComplete;
                      console.log('Task Checked');
                      return true;
                    }}
                    setCurrentTask={(task) => {
                      console.log('Task Selected');
                    }}
                  />
                );
              })}
            </TaskList.TableRoot>
          </TaskList.Root>
          {/* Vertical divider */}
          <div className='hidden md:block w-[75%] h-0 md:w-0 md:h-[80%] my-4 md:mx-4 md:my-0 border-1 self-center'></div>

          {/* ── Right: task detail ───────────────────────────────────────────────────────── */}
          <div className='hidden w-full h-full md:w-2/3 p-6 md:flex items-start'>
            <h2 className='text-2xl font-bold'>Taskname</h2>
            <div className='mt-4 space-y-2 text-sm leading-relaxed'>
              <p>
                Task Description Task Description Task Description Task
                Description Task Description Task Description Task Description
                Task Description
              </p>
              <p>
                Task Description Task Description Task Description Task
                Description Task Description Task Description Task Description
                Task Description
              </p>
              <p>Task Description Task Description Task Description</p>
            </div>
            <div className='mt-6 flex flex-wrap gap-3'>
              <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white'>
                Medium
              </span>
              <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full border border-border'>
                Not Started
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
