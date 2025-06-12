'use client';

import Link from 'next/link';

import * as WorkspaceCard from '@/components/cards/workspaceCard';
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
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>My Workspaces</h1>

      <Link
        href='/workspaces/new'
        className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md mb-6'
      >
        <IconPlus size={18} className='mr-2' />
        Create New Workspace
      </Link>

      {workspaces.length === 0 ? (
        <div className='bg-gray-100 p-8 rounded-lg text-center'>
          <p className='text-gray-600'>
            No workspaces found. Create your first workspace!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {workspaces.map((workspace) => (
            <WorkspaceCard.Root key={workspace.id}>
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
