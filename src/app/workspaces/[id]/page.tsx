'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconLoader,
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconPlus,
} from '@tabler/icons-react';
import Link from 'next/link';
import workspaceService from '@/services/workspace.service';
import workspace, { Workspace } from '@/schemas/workspace';
import listService from '@/services/list.service';
import taskService from '@/services/task.service';
import { List } from '@/schemas/list';
import { Task } from '@/schemas/task';

export default function WorkspaceDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const id = parseInt(params.id);
        const foundWorkspace = workspaceService.getById(id);

        if (!foundWorkspace) {
          router.push('/workspaces');
          return;
        }

        setWorkspace(foundWorkspace);

        // Load lists for this workspace
        const workspaceLists = listService.getByWorkspaceId(id);
        setLists(workspaceLists);
        // Load tasks for all lists in this workspace
        const allTasks = workspaceLists.flatMap((list: List) =>
          taskService.getByListId(list.id)
        );
        setTasks(allTasks);
      } catch (error) {
        console.error('Error loading workspace data:', error);
        router.push('/workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, router]);

  const handleDelete = () => {
    if (
      workspace &&
      confirm('Are you sure you want to delete this workspace?')
    ) {
      workspaceService.delete(workspace.id);
      router.push('/workspaces');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-200 text-green-800';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800';
      case 'waiting':
        return 'bg-yellow-200 text-yellow-800';
      case 'not-started':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <IconLoader className='animate-spin' size={32} />
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className='container mx-auto p-4'>
      <Link
        href='/workspaces'
        className='inline-flex items-center text-blue-600 mb-6'
      >
        <IconArrowLeft size={18} className='mr-1' />
        Back to Workspaces
      </Link>

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{workspace.name}</h1>
        <div className='flex space-x-2'>
          <Link
            href={`/workspaces/${workspace.id}/edit`}
            className='p-2 bg-gray-200 rounded-md'
          >
            <IconEdit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className='p-2 bg-red-100 text-red-600 rounded-md'
          >
            <IconTrash size={18} />
          </button>
        </div>
      </div>

      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='flex items-center mb-4'>
          <IconLayoutDashboard size={24} className='mr-2 text-gray-500' />
          <h2 className='text-xl font-medium'>Workspace Details</h2>
        </div>

        <p className='text-gray-600 mb-4'>{workspace.description}</p>

        <div className='flex flex-wrap gap-2 mb-4'>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(workspace.priority)}`}
          >
            Priority: {workspace.priority}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(workspace.status)}`}
          >
            Status: {workspace.status}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Lists Section */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium'>Lists</h2>
            <Link
              href={`/workspaces/${workspace.id}/lists/new`}
              className='inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md'
            >
              <IconPlus size={16} className='mr-1' />
              Add List
            </Link>
          </div>

          {lists.length === 0 ? (
            <div className='bg-gray-100 p-4 rounded-lg text-center'>
              <p className='text-gray-600'>
                No lists found. Create your first list!
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {lists.map((list) => (
                <div key={list.id} className='border rounded-lg p-4'>
                  <h3 className='font-medium'>{list.name}</h3>
                  <div className='flex justify-end mt-2 space-x-2'>
                    <Link
                      href={`/workspaces/${workspace.id}/lists/${list.id}/edit`}
                      className='text-gray-600 hover:text-gray-900'
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm('Are you sure you want to delete this list?')
                        ) {
                          listService.delete(list.id);
                          setLists(lists.filter((l) => l.id !== list.id));
                        }
                      }}
                      className='text-red-600 hover:text-red-900'
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-medium'>Tasks</h2>
            <Link
              href={`/workspaces/${workspace.id}/tasks/new`}
              className='inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md'
            >
              <IconPlus size={16} className='mr-1' />
              Add Task
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className='bg-gray-100 p-4 rounded-lg text-center'>
              <p className='text-gray-600'>
                No tasks found. Add your first task!
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {tasks.map((task) => (
                <div key={task.id} className='border rounded-lg p-4'>
                  <h3 className='font-medium'>{task.name}</h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    List:{' '}
                    {lists.find((l) => l.id === task.listId)?.name || 'Unknown'}
                  </p>
                  <div className='flex justify-end mt-2 space-x-2'>
                    <Link
                      href={`/workspaces/${workspace.id}/tasks/${task.id}/edit`}
                      className='text-gray-600 hover:text-gray-900'
                    >
                      <IconEdit size={16} />
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm('Are you sure you want to delete this task?')
                        ) {
                          taskService.delete(task.id);
                          setTasks(tasks.filter((t) => t.id !== task.id));
                        }
                      }}
                      className='text-red-600 hover:text-red-900'
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
