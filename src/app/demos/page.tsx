import { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  Code,
  Layers,
  Smartphone,
  Monitor,
  Filter,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Demos & Projects | Ian Lintner - Full Stack Developer",
  description:
    "Interactive demos and projects showcasing modern web development techniques, React components, and full-stack applications.",
  keywords: [
    "web development demos",
    "React components",
    "Next.js projects",
    "TypeScript examples",
    "interactive demos",
    "don't break",
  ],
  openGraph: {
    title: "Demos & Projects | Ian Lintner - Full Stack Developer",
    description:
      "Interactive demos and projects showcasing modern web development techniques, React components, and full-stack applications.",
    type: "website",
    url: "/demos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Demos & Projects | Ian Lintner - Full Stack Developer",
    description:
      "Interactive demos and projects showcasing modern web development techniques, React components, and full-stack applications.",
  },
};

// Mock demo data - will be replaced with tRPC calls
const mockDemos = [
  {
    id: "1",
    title: "Interactive Dashboard Components",
    slug: "interactive-dashboard-components",
    description:
      "A collection of reusable dashboard components built with React, TypeScript, and Tailwind CSS. Features responsive charts, data tables, and real-time updates.",
    category: "UI_COMPONENTS",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    githubUrl: "https://github.com/example/dashboard-components",
    liveUrl: "https://dashboard-demo.example.com",
    imageUrl: "/demos/dashboard-components.jpg",
    featured: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Real-time Chat Application",
    slug: "realtime-chat-application",
    description:
      "Full-stack chat application with real-time messaging, user authentication, and message history. Built with Next.js, Socket.io, and PostgreSQL.",
    category: "FULL_STACK",
    technologies: [
      "Next.js",
      "Socket.io",
      "PostgreSQL",
      "Prisma",
      "NextAuth.js",
    ],
    githubUrl: "https://github.com/example/chat-app",
    liveUrl: "https://chat-demo.example.com",
    imageUrl: "/demos/chat-app.jpg",
    featured: true,
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    title: "E-commerce Product Showcase",
    slug: "ecommerce-product-showcase",
    description:
      "Modern e-commerce product pages with advanced filtering, search functionality, and shopping cart integration. Optimized for performance and SEO.",
    category: "FULL_STACK",
    technologies: ["Next.js", "Stripe", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/example/ecommerce-showcase",
    liveUrl: "https://shop-demo.example.com",
    imageUrl: "/demos/ecommerce-showcase.jpg",
    featured: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    title: "Custom React Hooks Library",
    slug: "custom-react-hooks-library",
    description:
      "A comprehensive collection of custom React hooks for common use cases including API calls, local storage, debouncing, and more.",
    category: "UI_COMPONENTS",
    technologies: ["React", "TypeScript", "Jest", "Storybook"],
    githubUrl: "https://github.com/example/react-hooks-library",
    liveUrl: "https://hooks-demo.example.com",
    imageUrl: "/demos/react-hooks.jpg",
    featured: false,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "Data Visualization Dashboard",
    slug: "data-visualization-dashboard",
    description:
      "Interactive data visualization dashboard with multiple chart types, real-time data updates, and export functionality.",
    category: "DATA_VISUALIZATION",
    technologies: ["React", "D3.js", "TypeScript", "WebSocket"],
    githubUrl: "https://github.com/example/data-viz-dashboard",
    liveUrl: "https://dataviz-demo.example.com",
    imageUrl: "/demos/data-viz.jpg",
    featured: false,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "6",
    title: "Progressive Web App Template",
    slug: "progressive-web-app-template",
    description:
      "A complete PWA template with offline functionality, push notifications, and app-like experience on mobile devices.",
    category: "FULL_STACK",
    technologies: ["Next.js", "Service Workers", "Web Push API", "IndexedDB"],
    githubUrl: "https://github.com/example/pwa-template",
    liveUrl: "https://pwa-demo.example.com",
    imageUrl: "/demos/pwa-template.jpg",
    featured: false,
    createdAt: new Date("2024-01-08"),
  },
];

const categories = [
  { value: "all", label: "All Projects", icon: Layers },
  { value: "FULL_STACK", label: "Full Stack", icon: Code },
  { value: "UI_COMPONENTS", label: "UI Components", icon: Smartphone },
  { value: "DATA_VISUALIZATION", label: "Data Visualization", icon: Monitor },
];

export default function DemosPage() {
  const demos = mockDemos;
  const featuredDemos = demos.filter((demo) => demo.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-background to-accent/30 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Projects & Demos
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Interactive demos and projects showcasing modern web development
              techniques, React components, and full-stack applications.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Featured Projects */}
          {featuredDemos.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredDemos.map((demo) => (
                  <div
                    key={demo.id}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <Code className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Demo Preview
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {demo.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {demo.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {demo.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {demo.technologies.length > 4 && (
                          <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
                            +{demo.technologies.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <a
                          href={demo.liveUrl}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                        <a
                          href={demo.githubUrl}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* All Projects Grid */}
          <section>
            <h2 className="text-3xl font-bold mb-8">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demos.map((demo) => (
                <div
                  key={demo.id}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Demo Preview
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {demo.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {demo.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {demo.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                          +{demo.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <a
                        href={demo.liveUrl}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Demo
                      </a>
                      <a
                        href={demo.githubUrl}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-3 w-3" />
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Interested in Working Together?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                I&apos;m always excited to work on new projects and collaborate
                with talented teams. Let&apos;s build something amazing
                together!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View My Articles
                </Link>
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border border-input bg-background hover:bg-accent transition-colors rounded-lg"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
