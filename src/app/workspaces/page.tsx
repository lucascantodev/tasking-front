"use client";

import Link from "next/link";
import { IconPlus, IconEdit, IconTrash, IconLoader } from "@tabler/icons-react";
import { useWorkspaces } from '@/contexts/workspaces-context';

export default function Workspaces() {
  const { workspaces, isLoading, error, deleteWorkspace } = useWorkspaces();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      deleteWorkspace(id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-200 text-red-800";
      case "medium": return "bg-yellow-200 text-yellow-800";
      case "low": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-200 text-green-800";
      case "in-progress": return "bg-blue-200 text-blue-800";
      case "waiting": return "bg-yellow-200 text-yellow-800";
      case "not-started": return "bg-gray-200 text-gray-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <IconLoader className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Workspaces</h1>
      
      <Link href="/workspaces/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md mb-6">
        <IconPlus size={18} className="mr-2" />
        Create New Workspace
      </Link>

      {workspaces.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No workspaces found. Create your first workspace!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="p-4">
                <h2 className="text-xl font-semibold">{workspace.name}</h2>
                <p className="text-gray-600 mt-2">{workspace.description}</p>
                
                <div className="flex mt-4 space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(workspace.priority)}`}>
                    {workspace.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(workspace.status)}`}>
                    {workspace.status}
                  </span>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Link href={`/workspaces/${workspace.id}`} className="text-blue-600 hover:underline">
                    View Tasks
                  </Link>
                  <div className="flex space-x-2">
                    <Link href={`/workspaces/${workspace.id}/edit`} className="text-gray-600 hover:text-gray-900">
                      <IconEdit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(workspace.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}