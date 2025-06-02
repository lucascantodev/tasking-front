"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useWorkspace } from "@/contexts/workspace-context";
import { Workspace } from "@/schemas/workspace";

export default function EditWorkspace({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { 
    workspaces, 
    currentWorkspace, 
    setCurrentWorkspace, 
    updateWorkspace, 
    isLoading, 
    error 
  } = useWorkspace();

  useEffect(() => {
    const id = parseInt(params.id);
    const workspace = workspaces.find(w => w.id === id);
    
    if (!workspace) {
      router.push("/workspaces");
      return;
    }
    
    setCurrentWorkspace(workspace);
  }, [params.id, workspaces, router, setCurrentWorkspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    try {
      await updateWorkspace(currentWorkspace);
      router.push(`/workspaces/${currentWorkspace.id}`);
    } catch (error) {
      console.error("Error updating workspace:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!currentWorkspace) return;
    const { name, value } = e.target;
    setCurrentWorkspace({ ...currentWorkspace, [name]: value });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href={`/workspaces/${currentWorkspace.id}`} className="inline-flex items-center text-blue-600 mb-6">
        <IconArrowLeft size={18} className="mr-1" />
        Back to Workspace
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Workspace</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={currentWorkspace.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={currentWorkspace.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={currentWorkspace.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={currentWorkspace.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="waiting">Waiting</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 