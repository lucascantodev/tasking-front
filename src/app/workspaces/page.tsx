'use client';

import * as WorkspaceCard from '@/components/cards/workspaceCard';
import CreateNewSection from '@/components/layout/sections/main/createNewSection';
import {
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconLoader,
} from '@tabler/icons-react';
import { useWorkspaces } from '@/contexts/workspaces-context';

export default function Workspaces() {
  const { workspaces, isLoading, error, deleteWorkspace } = useWorkspaces();

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(id);
    }
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
            dark grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-full w-full bg-background border-y-1 
            border-foreground p-4
          '
        >
          {workspaces.map((workspace) => (
            <WorkspaceCard.Root className='' key={workspace.id}>
              <WorkspaceCard.CardInfos>
                <WorkspaceCard.Title title={workspace.name} />
                <WorkspaceCard.Description text={workspace.description} />

                <WorkspaceCard.BadgesContainer>
                  <WorkspaceCard.PriorityBadge priority={workspace.priority} />
                  <WorkspaceCard.StatusBadge status={workspace.status} />
                </WorkspaceCard.BadgesContainer>
              </WorkspaceCard.CardInfos>

              <WorkspaceCard.ButtonsContainer>
                <WorkspaceCard.Button title='add task' onClick={() => {}}>
                  <IconPlus color='#FAFAFA' size={18} />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='view tasks'
                  onClick={() =>
                    window.open(`/workspaces/${workspace.id}`, '_self')
                  }
                >
                  <IconEye color='#FAFAFA' size={18} />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='edit workspace'
                  onClick={() =>
                    window.open(`/workspaces/${workspace.id}/edit`, '_self')
                  }
                >
                  <IconEdit color='#FAFAFA' size={18} />
                </WorkspaceCard.Button>
                <WorkspaceCard.Button
                  title='delete workspace'
                  onClick={() => handleDelete(workspace.id)}
                >
                  <IconTrash color='#FAFAFA' size={18} />
                </WorkspaceCard.Button>
              </WorkspaceCard.ButtonsContainer>
            </WorkspaceCard.Root>
          ))}
        </div>
      )}
    </div>
  );
}
