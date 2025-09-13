"use client";

import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import Link from "next/link";
import type { DemoCategory } from "../../../types";

const categoryLabels = {
  REACT: "React",
  NEXTJS: "Next.js",
  TYPESCRIPT: "TypeScript",
  CSS: "CSS",
  ANIMATION: "Animation",
  API: "API",
  DATABASE: "Database",
};

export default function DemosManagement() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const { data: demos, isLoading, refetch } = trpc.demo.getAll.useQuery();
  const deleteMutation = trpc.demo.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredDemos =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (demos as any)?.filter((demo: any) => {
      if (filter === "published") return demo.published;
      if (filter === "draft") return !demo.published;
      return true;
    }) || [];

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert("Failed to delete demo. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Component Demos</h1>
          <p className="text-muted-foreground">
            Manage your component demonstrations
          </p>
        </div>
        <Link
          href="/admin/demos/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          Create New Demo
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All Demos
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "published"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "draft"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Demos Grid */}
      <div className="bg-card text-card-foreground rounded-lg border">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading demos...
            </p>
          </div>
        ) : filteredDemos.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">No demos found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {filter === "all"
                ? "You haven't created any demos yet."
                : `No ${filter} demos found.`}
            </p>
            <Link
              href="/admin/demos/new"
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Create Your First Demo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredDemos.map((demo: any) => (
              <div
                key={demo.id}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium truncate mb-1">
                      {demo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {demo.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {categoryLabels[demo.category as DemoCategory]}
                      </span>
                      {demo.published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {demo.technologies
                      .slice(0, 3)
                      .map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    {demo.technologies.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{demo.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{new Date(demo.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/demos/${demo.id}/edit`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  >
                    Edit
                  </Link>
                  {demo.published && (
                    <a
                      href={`/demos/${demo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(demo.id, demo.name)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
