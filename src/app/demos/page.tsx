import { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
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
    id: "7",
    title: "Rust OAuth2 Server",
    slug: "rust-oauth2-server",
    description:
      "A modern OAuth2/OIDC authorization server built in Rust with Actix-Web and the actor model. Includes discovery, JWKS, token introspection/revocation, best-effort auth eventing, OpenAPI/Swagger UI, Prometheus/OpenTelemetry, and Kubernetes-ready health/readiness endpoints.",
    category: "FULL_STACK",
    technologies: [
      "Rust",
      "OAuth2",
      "OIDC",
      "Actix",
      "PostgreSQL",
      "Kubernetes",
    ],
    githubUrl: "https://github.com/ianlintner/rust-oauth2-server",
    liveUrl: "https://ianlintner.github.io/rust-oauth2-server/",
    imageUrl: "/demos/rust-oauth2-server.jpg",
    featured: true,
    createdAt: new Date("2025-12-20"),
  },
  {
    id: "6",
    title: "OAuth2 Proxy Sidecar",
    slug: "oauth2-sidecar",
    description:
      "Production-ready OAuth2 authentication for Kubernetes using the sidecar pattern. Includes Helm charts, custom sign-in templates, and SSO support for GitHub, Google, Azure AD, and generic OIDC providers. Eliminates complex centralized auth services in favor of per-app authentication containers.",
    category: "FULL_STACK",
    technologies: ["Kubernetes", "OAuth2", "Istio", "Helm", "Security"],
    githubUrl: "https://github.com/ianlintner/authproxy",
    liveUrl: "https://ianlintner.github.io/authproxy/",
    imageUrl: "/demos/oauth2-sidecar.jpg",
    featured: true,
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "5",
    title: "Authentication Showcase",
    slug: "authentication-showcase",
    description:
      "A comprehensive demo of major authentication methods in modern web applications. Demonstrates email/password, OAuth 2.0, magic links, MFA, and session management with AI-enforced security best practices.",
    category: "FULL_STACK",
    technologies: ["Next.js", "NextAuth.js", "OAuth", "Security"],
    githubUrl: "https://github.com/ianlintner/authentication-showc",
    liveUrl: "https://auth-demo.cat-herding.net",
    imageUrl: "/demos/auth-showcase.jpg",
    featured: true,
    createdAt: new Date("2025-11-24"),
  },
  {
    id: "1",
    title: "Interview Data Structures & Algorithms Study App",
    slug: "interview-data-structures-algorithms-study-app",
    description:
      "A comprehensive study app for mastering data structures and algorithms through interactive coding challenges and real-time collaboration.",
    category: "FULL_STACK",
    technologies: ["Python", "Flask"],
    githubUrl: "https://github.com/ianlintner/python_dsa",
    liveUrl: "https://dsa.cat-herding.net",
    imageUrl: "/demos/interview-data-structures.jpg",
    featured: true,
    createdAt: new Date("2025-08-01"),
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
      "Drizzle ORM",
      "NextAuth.js",
    ],
    githubUrl: "https://github.com/ianlintner/Example-React-AI-Chat-App",
    liveUrl: "https://chat.cat-herding.net",
    imageUrl: "/demos/chat-app.jpg",
    featured: true,
    createdAt: new Date("2025-07-18"),
  },
  {
    id: "3",
    title: "GCP Autopilot Kubernetes Cluster",
    slug: "gcp-autopilot-kubernetes-cluster",
    description:
      "The cluster is built on **Google Cloud Platform (GCP)** using **Anthos GKE Autopilot**, which provides a managed Kubernetes control plane with automated node provisioning, scaling, and security hardening. Infrastructure provisioning and lifecycle management are handled with **Terraform**, ensuring reproducibility and version-controlled infrastructure-as-code. This cluster hosts all these demos.",
    category: "FULL_STACK",
    technologies: ["GCP", "Kubernetes", "Docker"],
    githubUrl: "https://github.com/ianlintner",
    liveUrl: "https://github.com/ianlintner",
    imageUrl: "/demos/gcp-autopilot.jpg",
    featured: true,
    createdAt: new Date("2025-06-30"),
  },
  {
    id: "4",
    title: "Audio Analysis and AI Review Utility in Rust",
    slug: "audio-ai-rust",
    description:
      "A command-line utility written in Rust for analyzing audio and providing AI-powered feedback for guitar practice sessions.",
    category: "FULL_STACK",
    technologies: ["Rust", "FFmpeg", "AI"],
    githubUrl: "https://github.com/ianlintner/audio-ai",
    liveUrl: "https://github.com/ianlintner/audio-ai",
    imageUrl: "/demos/audio-ai.jpg",
    featured: true,
    createdAt: new Date("2025-09-29"),
  },
];

const categories = [
  { value: "all", label: "All Projects", icon: Layers },
  { value: "FULL_STACK", label: "Full Stack", icon: Code },
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
                          View Project
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
                        View Project
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
