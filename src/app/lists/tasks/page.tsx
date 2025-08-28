'use client';

import {
  IconExclamationCircle,
  IconLoader,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';

import * as CreateSec from '@components/layout/sections/main/createNewSection';
import * as TaskList from '@components/layout/listviews/tasksListView';
import { TaskPriority } from '@/components/badges/taskPriority';
import { TaskStatus } from '@/components/badges/taskStatus';
import { BottomUpModal } from '@/components/modals/bottomUpModal';
import { useList } from '@/contexts/list-context';
import { useTasks } from '@/contexts/tasks-context';
import { useState, useEffect } from 'react';
import { Task } from '@/dto/task';
import CreateTaskModal from '@/components/forms/createTask';

export default function TasksPage() {
  const { currentList } = useList();
  const {
    tasks,
    isLoading,
    error,
    currentTask,
    setCurrentTask,
    getTasksByListId,
    refreshTasks,
  } = useTasks();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

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

  const handleTaskSelect = (task: Task) => {
    const mq = window.matchMedia('(width >= 768px)'); // md: tw media match

    if (mq.matches) {
      setCurrentTask(task);
      setIsDetailModalOpen(false);
    } else {
      setCurrentTask(task);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    refreshTasks();
  };

  if (error || !currentList) {
    const actualError =
      !error && !currentList
        ? "Couldn't find selected list data. Try login on or retry."
        : null;

    return (
      <div className='flex flex-col justify-center items-center h-64 space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <IconExclamationCircle className='text-red-500' size={48} />
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              Failed to load tasks
            </h3>
            <p className='text-gray-600 max-w-md'>
              {actualError ||
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

  const listTasks = getTasksByListId(currentList.id);

  return (
    <main className='h-full'>
      {/* START - Create a new section */}
      <CreateSec.Root>
        <CreateSec.Container>
          <CreateSec.Label>Create a new Task!</CreateSec.Label>
          <CreateSec.Button onClick={handleOpenCreateModal}>
            <span className='font-bold text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl 4xl:text-3xl 5xl:text-4xl'>
              Add a Task
            </span>
            <IconPlus className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 5xl:w-16 5xl:h-16' />
          </CreateSec.Button>
        </CreateSec.Container>
      </CreateSec.Root>
      {/* END - Create a new section */}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        currentListId={currentList.id}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />

      <section className='w-full h-[80%] min-h-[90%] mb-4 border-y-1 border-white'>
        <div className='w-full h-full min-h-full flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 p-4'>
          {/* ── Left: tasks list ─────────────────────────────────────────────────────────── */}
          <TaskList.Root>
            <TaskList.TableRoot>
              {listTasks!.map((v, i) => {
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
                    setCurrentTask={handleTaskSelect}
                  />
                );
              })}
            </TaskList.TableRoot>
          </TaskList.Root>
          {/* Vertical divider */}
          <div className='hidden md:block w-[75%] h-0 md:w-0 md:h-[80%] my-4 md:mx-4 md:my-0 border-1 self-center'></div>

          {/* ── Right: task detail ───────────────────────────────────────────────────────── */}
          {isDetailModalOpen ? (
            <div className='dark w-full h-3/4 md:w-2/3 md:hidden'>
              <BottomUpModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title='Task Details'
              >
                <h2
                  className='
                    dark text-foreground font-bold break-all
                    text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                    4xl:text-6xl 5xl:text-7xl
                  '
                >
                  {currentTask ? currentTask.name : 'No Task Selected :/'}
                </h2>
                {currentTask ? (
                  <>
                    <div
                      className='
                        dark mt-4 xl:mt-6 2xl:mt-7 4xl:mt-8 space-y-2 leading-relaxed
                        text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 
                        4xl:text-3xl 5xl:text-4xl
                      '
                    >
                      <p className='text-foreground break-all'>
                        {currentTask.description}
                      </p>
                    </div>
                    <div
                      className='
                        mt-6 xl:mt-8 2xl:mt-8.5 4xl:mt-10 flex flex-wrap gap-2
                        sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 
                        4xl:gap-8 5xl:gap-9
                      '
                    >
                      <TaskPriority priority={currentTask.priority} />
                      <TaskStatus status={currentTask.status} />
                    </div>
                  </>
                ) : null}
              </BottomUpModal>
            </div>
          ) : (
            <div className='dark hidden w-full h-3/4 md:w-2/3 p-6 md:flex flex-col items-start'>
              <h2
                className='
                  dark text-foreground font-bold break-all
                  text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                  4xl:text-6xl 5xl:text-7xl
                '
              >
                {currentTask ? currentTask.name : 'No Task Selected :/'}
              </h2>
              {currentTask ? (
                <>
                  <div
                    className='
                      dark mt-4 xl:mt-6 2xl:mt-7 4xl:mt-8 space-y-2 leading-relaxed
                      text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 
                      4xl:text-3xl 5xl:text-4xl
                    '
                  >
                    <p className='text-foreground break-all'>
                      {currentTask.description}
                    </p>
                  </div>
                  <div
                    className='
                      mt-6 xl:mt-8 2xl:mt-8.5 4xl:mt-10 flex flex-wrap gap-2
                      sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 
                      4xl:gap-8 5xl:gap-9
                    '
                  >
                    <TaskPriority priority={currentTask.priority} />
                    <TaskStatus status={currentTask.status} />
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
