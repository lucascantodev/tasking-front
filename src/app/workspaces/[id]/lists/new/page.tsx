"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import listService from "@/services/list.service";
import { List } from "@/schemas/List";

export default function NewList({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<List, "id">>({
    workspaceId: parseInt(params.id),
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newList = listService.create(formData);
      router.push(`/workspaces/${params.id}`);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Failed to create list. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <Link href={`/workspaces/${params.id}`} className="inline-flex items-center text-blue-600 mb-6">
        <IconArrowLeft size={18} className="mr-1" />
        Back to Workspace
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New List</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 