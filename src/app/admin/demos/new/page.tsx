"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";

const categoryOptions = [
  { value: "REACT", label: "React" },
  { value: "NEXTJS", label: "Next.js" },
  { value: "TYPESCRIPT", label: "TypeScript" },
  { value: "CSS", label: "CSS" },
  { value: "ANIMATION", label: "Animation" },
  { value: "API", label: "API" },
  { value: "DATABASE", label: "Database" },
] as const;

export default function NewDemo() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]["value"]>("REACT");
  const [technologies, setTechnologies] = useState("");
  const [published, setPublished] = useState(false);

  const createMutation = trpc.demo.create.useMutation({
    onSuccess: () => {
      router.push("/admin/demos");
    },
    onError: (error) => {
      alert(`Failed to create demo: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !code.trim()) {
      alert("Name, description, and code are required");
      return;
    }

    const techArray = technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        code: code.trim(),
        demoUrl: demoUrl.trim() || undefined,
        category,
        technologies: techArray,
        published,
      });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Demo</h1>
          <p className="text-muted-foreground">
            Create a new component demonstration
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Demo Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter demo name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of the demo"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Code *
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={20}
                className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="Paste your component code here..."
                required
              />
              <p className="text-xs text-muted-foreground">
                Include the complete component code that visitors can copy and
                use.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="demoUrl" className="text-sm font-medium">
                Demo URL (Optional)
              </label>
              <input
                id="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://example.com/demo"
              />
              <p className="text-xs text-muted-foreground">
                Link to a live demo or sandbox (CodeSandbox, CodePen, etc.)
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Publish</h3>
              <div className="flex items-center space-x-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                {published
                  ? "This demo will be visible to visitors immediately after creation."
                  : "This demo will be saved as a draft and not visible to visitors."}
              </p>
            </div>

            {/* Category */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Category</h3>
              <div className="space-y-2">
                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as typeof category)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Choose the primary category for this demo
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium">Technologies</h3>
              <div className="space-y-2">
                <input
                  id="technologies"
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="React, TypeScript, Tailwind CSS"
                />
                <p className="text-xs text-muted-foreground">
                  Separate technologies with commas
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              {createMutation.isLoading
                ? "Creating..."
                : published
                  ? "Create & Publish"
                  : "Save Draft"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
