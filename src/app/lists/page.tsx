'use client';

import { useState } from 'react';
import * as LCard from '@/components/cards/listCard';
import CreateNewSection from '@/components/layout/sections/main/createNewSection';
import CreateListModal from '@/components/forms/createList';
import { useList } from '@/contexts/list-context';
import {
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconLoader,
  IconZzz,
  IconTilde,
  IconAlertTriangleFilled,
  IconCalendarFilled,
  IconBoltFilled,
  IconCheckbox,
  IconClockHour2Filled,
  IconExclamationCircle,
  IconRefresh,
} from '@tabler/icons-react';
import { ListPlus } from 'lucide-react';
import { Priority, Status } from '@/dto/list';
import { ListSchema_Type } from '@/schemas/list';

export default function Workspaces() {
  console.log('Workspaces Component State: ', {
    lists: useList().lists,
    isLoading: useList().isLoading,
    error: useList().error,
  });

  const { lists, isLoading, error, deleteList, refreshLists } = useList();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this list?')) {
      deleteList(id);
    }
  };

  const handleRetry = () => {
    refreshLists();
  };

  const handleCreateList = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleListCreated = (list: ListSchema_Type) => {
    console.log('List created:', list);
    refreshLists();
  };

  const getPriorityTitle = (priority: Priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getPriorityIcon = (priority: Priority) => {
    const icons = {
      low: <IconZzz color='#FAFAFA' className='size-[1.5em]' />,
      medium: <IconTilde color='#FAFAFA' className='size-[1.5em]' />,
      high: (
        <IconAlertTriangleFilled
          color='#FAFAFA'
          className='size-[1.5em]'
          strokeLinecap='square'
          strokeLinejoin='bevel'
        />
      ),
    };

    return icons[priority];
  };

  const getStatusTitle = (status: Status) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusIcon = (status: Status) => {
    const icons = {
      'not-started': <IconCalendarFilled color='#FAFAFA' />,
      'in-progress': <IconBoltFilled color='#FAFAFA' />,
      completed: <IconCheckbox color='#FAFAFA' />,
      waiting: <IconClockHour2Filled color='#FAFAFA' />,
    };

    return icons[status];
  };

  if (isLoading) {
    return (
      <div className='flex flex-col justify-center items-center h-64 space-y-4'>
        <IconLoader className='animate-spin text-blue-500' size={40} />
        <p className='text-gray-600'>Loading your lists...</p>
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
              Failed to load lists
            </h3>
            <p className='text-gray-600 max-w-md'>
              {error ||
                'Something went wrong while loading your lists. Please try again.'}
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

  return (
    <>
      <div className='container min-w-full w-full m-0 border-0 p-0'>
        <div className='dark w-full bg-background text-foreground py-6 px-4'>
          <div className='flex gap-6 items-center'>
            <span className='text-2xl font-medium'>Create a new List!</span>
            <button
              onClick={handleCreateList}
              className='
                flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gradient-to-r from-neutral-900 via-black to-neutral-800
                text-white font-bold shadow-lg border border-neutral-700
                transition-all duration-300
                hover:scale-105 hover:bg-neutral-950 hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-neutral-600
                animate-bounce hover:animate-none cursor-pointer
              '
            >
              <ListPlus className='size-6 animate-pulse' />
              <span className='font-semibold'>Add List</span>
            </button>
          </div>
        </div>

        {lists.length === 0 ? (
          <div className='flex flex-col justify-center items-center h-64 space-y-6'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='text-center'>
                <h3 className='text-2xl font-semibold text-white mb-2'>
                  No lists yet :(
                </h3>
                <p className='text-white max-w-md'>
                  Get started by creating your first list to organize your tasks
                  and boost your productivity.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* list grid */
          <div
            className='
              dark grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-5 4xl:gap-6 
              min-w-full w-full bg-background border-y-1 border-foreground p-4 2xl:p-5 4xl:p-6
            '
          >
            {lists.map((list) => (
              <LCard.Root className='' key={list.id}>
                <LCard.CardInfos>
                  <LCard.Title title={list.name} />
                  <LCard.Description
                    text={list.description || 'No description'}
                  />

                  <LCard.BadgesContainer>
                    <LCard.Badge>
                      {getPriorityIcon(list.priority)}
                      <span>{getPriorityTitle(list.priority)}</span>
                    </LCard.Badge>
                    <LCard.Badge>
                      {getStatusIcon(list.status)}
                      <span>{getStatusTitle(list.status)}</span>
                    </LCard.Badge>
                  </LCard.BadgesContainer>
                </LCard.CardInfos>

                <LCard.ButtonsContainer>
                  <LCard.Button title='add task' onClick={() => {}}>
                    <IconPlus color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='view tasks'
                    onClick={() => window.open(`/lists/${list.id}`, '_self')}
                  >
                    <IconEye color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='edit list'
                    onClick={() =>
                      window.open(`/lists/${list.id}/edit`, '_self')
                    }
                  >
                    <IconEdit color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='delete list'
                    onClick={() => handleDelete(list.id)}
                  >
                    <IconTrash color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                </LCard.ButtonsContainer>
              </LCard.Root>
            ))}
          </div>
        )}
      </div>
      {/* create list modal */}
      <CreateListModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleListCreated}
      />
    </>
  );
}
