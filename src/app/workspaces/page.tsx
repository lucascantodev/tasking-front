'use client';

import * as WorkspaceCard from '@/components/cards/workspaceCard';
import CreateNewSection from '@/components/layout/sections/main/createNewSection';
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
} from '@tabler/icons-react';

import { Priority, Status } from '@/schemas/Workspace';
import { useWorkspaces } from '@/contexts/workspaces-context';

export default function Workspaces() {
  const { workspaces, isLoading, error, deleteWorkspace } = useWorkspaces();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(id);
    }
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
      <div className='flex justify-center items-center h-64'>
        <IconLoader className='animate-spin' size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div
      className='
        container min-w-full w-full m-0 border-0 p-0
      '
    >
      <CreateNewSection
        href='/'
        labelText='Create a new Workspace!'
        buttonText={[
          <span key={1} className='font-[700] text-[1em]'>
            Add a Workspace
          </span>,
          <IconPlus key={2} className='size-[1.75em]' />,
        ]}
      />
      {workspaces.length === 0 ? (
        <div className='bg-gray-100 p-8 rounded-lg text-center'>
          <p className='text-gray-600'>
            No workspaces found. Create your first workspace!
          </p>
        </div>
      ) : (
        <div
          className='
            dark grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 2xl:gap-5 4xl:gap-6 min-w-full w-full bg-background border-y-1 
            border-foreground p-4 2xl:p-5 4xl:p-6
          '
        >
          {workspaces.map((workspace) => (
            <WorkspaceCard.Root className='' key={workspace.id}>
              <WorkspaceCard.CardInfos>
                <WorkspaceCard.Title title={workspace.name} />
                <WorkspaceCard.Description text={workspace.description} />

                <WorkspaceCard.BadgesContainer>
                  <WorkspaceCard.Badge>
                    {getPriorityIcon(workspace.priority)}
                    <span>{getPriorityTitle(workspace.priority)}</span>
                  </WorkspaceCard.Badge>
                  <WorkspaceCard.Badge>
                    {getStatusIcon(workspace.status)}
                    <span>{getStatusTitle(workspace.status)}</span>
                  </WorkspaceCard.Badge>
                </WorkspaceCard.BadgesContainer>
              </WorkspaceCard.CardInfos>

              <WorkspaceCard.ButtonsContainer>
                <WorkspaceCard.Button title='add task' onClick={() => {}}>
                  <IconPlus color='#FAFAFA' className='size-[1em]' />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='view tasks'
                  onClick={() =>
                    window.open(`/workspaces/${workspace.id}`, '_self')
                  }
                >
                  <IconEye color='#FAFAFA' className='size-[1em]' />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='edit workspace'
                  onClick={() =>
                    window.open(`/workspaces/${workspace.id}/edit`, '_self')
                  }
                >
                  <IconEdit color='#FAFAFA' className='size-[1em]' />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='delete workspace'
                  onClick={() => handleDelete(workspace.id)}
                >
                  <IconTrash color='#FAFAFA' className='size-[1em]' />
                </WorkspaceCard.Button>
              </WorkspaceCard.ButtonsContainer>
            </WorkspaceCard.Root>
          ))}
        </div>
      )}
    </div>
  );
}
