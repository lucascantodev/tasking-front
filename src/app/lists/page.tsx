'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as LCard from '@/components/cards/listCard';
import * as CreateSec from '@/components/layout/sections/main/createNewSection';
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
import { List, Priority, Status } from '@/dto/list';
import CreateTaskModal from '@/components/forms/createTask';
import DeleteModal from '@/components/ui/DeleteModal';
import { CreateListSchema_Type } from '@/schemas/list';

export default function Workspaces() {
  console.log('Workspaces Component State: ', {
    lists: useList().lists,
    isLoading: useList().isLoading,
    error: useList().error,
  });

  const router = useRouter();
  const {
    lists,
    isLoading,
    error,
    currentList,
    setCurrentList,
    deleteList,
    refreshLists,
  } = useList();
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editList, setEditList] = useState<
    (Partial<CreateListSchema_Type> & { id?: number }) | null
  >(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteListId, setDeleteListId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRetry = () => {
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

  const handleOpenCreateEditModal = () => {
    setIsCreateEditModalOpen(true);
  };

  const handleCloseCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditList(null);
    setIsEdit(false);
  };

  const handleCreateSuccess = () => {
    refreshLists();
  };

  const handleOpenCreateTaskModal = (list: List) => {
    setIsCreateTaskModalOpen(true);
    setCurrentList(list);
  };

  const handleCloseCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
  };

  const handleCreateTaskSuccess = () => {
    // don't need to do anything, placewholder func
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeleteListId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteList = async () => {
    try {
      setDeleteLoading(true);
      await deleteList(deleteListId!);
      setDeleteLoading(false);
      refreshLists();

      handleCloseDeleteModal();
    } catch (err) {
      console.error('🚩 Failed to delete list:', err);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteListId(null);
  };

  return (
    <>
      <div className='container min-w-full w-full m-0 border-0 p-0'>
        <CreateSec.Root>
          <CreateSec.Container>
            <CreateSec.Label>Create a new List!</CreateSec.Label>
            <CreateSec.Button
              onClick={() => {
                setIsEdit(false);
                handleOpenCreateEditModal();
              }}
            >
              <span className='font-bold text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl 4xl:text-3xl 5xl:text-4xl'>
                Add a List
              </span>
              <IconPlus className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 4xl:w-13 4xl:h-13 5xl:w-16 5xl:h-16' />
            </CreateSec.Button>
          </CreateSec.Container>
        </CreateSec.Root>

        <CreateListModal
          isOpen={isCreateEditModalOpen}
          onClose={handleCloseCreateEditModal}
          onSuccess={handleCreateSuccess}
          initialData={editList ? editList : undefined}
          isEdit={isEdit}
        />

        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          currentListId={currentList ? currentList.id : 0}
          onClose={handleCloseCreateTaskModal}
          onSuccess={handleCreateTaskSuccess}
        />

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
                  <LCard.Button
                    title='add task'
                    onClick={() => {
                      handleOpenCreateTaskModal(list);
                    }}
                  >
                    <IconPlus color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='view tasks'
                    onClick={() => {
                      setCurrentList(list);
                      router.push(`/lists/tasks/`);
                    }}
                  >
                    <IconEye color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='edit list'
                    onClick={() => {
                      setIsEdit(true);
                      const { owner, ...editList } = list;
                      setEditList(
                        editList as Partial<CreateListSchema_Type> & {
                          id?: number;
                        }
                      );
                      handleOpenCreateEditModal();
                    }}
                  >
                    <IconEdit color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                  <LCard.Button
                    title='delete list'
                    onClick={() => handleOpenDeleteModal(list.id)}
                  >
                    <IconTrash color='#FAFAFA' className='size-[1em]' />
                  </LCard.Button>
                </LCard.ButtonsContainer>
              </LCard.Root>
            ))}
          </div>
        )}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onDelete={handleDeleteList}
          onClose={handleCloseDeleteModal}
          resourceName='list'
          loading={deleteLoading}
        />
      </div>
    </>
  );
}
