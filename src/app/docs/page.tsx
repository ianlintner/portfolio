import { Metadata } from "next";
import { getAbsoluteUrl, getDefaultSocialImage } from "@/lib/metadata";

const siteUrl = getAbsoluteUrl("/docs");
const imageUrl = getDefaultSocialImage();

export const metadata: Metadata = {
  title: "Documentation | Ian Lintner - Full Stack Developer",
  description:
    "Technical documentation for the portfolio and blog application. Learn about the architecture, development setup, deployment, and infrastructure.",
  keywords: [
    "documentation",
    "technical docs",
    "Next.js",
    "React",
    "TypeScript",
    "Kubernetes",
    "GKE",
    "DevOps",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Documentation | Ian Lintner - Full Stack Developer",
    description:
      "Technical documentation for the portfolio and blog application.",
    type: "website",
    url: siteUrl,
    siteName: "Ian Lintner - Full Stack Developer",
    locale: "en_US",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Ian Lintner - Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation | Ian Lintner - Full Stack Developer",
    description:
      "Technical documentation for the portfolio and blog application.",
    creator: "@ianlintner",
    images: [imageUrl],
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-background to-accent/30 dark:from-gray-900 dark:to-primary/20 py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
              Comprehensive technical documentation for developers. Learn about
              the architecture, setup, deployment, and best practices.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/docs/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Browse Full Docs
              </a>
              <a
                href="https://github.com/ianlintner/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-border hover:bg-accent transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Preview */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Start */}
            <a
              href="/docs/getting-started.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Getting Started
              </h3>
              <p className="text-sm text-muted-foreground">
                Quick setup guide to get the application running locally in
                minutes.
              </p>
            </a>

            {/* Architecture */}
            <a
              href="/docs/ARCHITECTURE.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Architecture
              </h3>
              <p className="text-sm text-muted-foreground">
                Learn about the application structure, data flow, and tech stack
                decisions.
              </p>
            </a>

            {/* Deployment */}
            <a
              href="/docs/AUTOMATIC_DEPLOYMENT_SETUP.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Deployment
              </h3>
              <p className="text-sm text-muted-foreground">
                Deploy to Kubernetes on GKE with automated CI/CD pipelines.
              </p>
            </a>

            {/* CLI Setup */}
            <a
              href="/docs/CLI_SETUP_INSTRUCTIONS.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                CLI Tools
              </h3>
              <p className="text-sm text-muted-foreground">
                Set up command-line tools for cloud deployment and management.
              </p>
            </a>

            {/* Contributing */}
            <a
              href="/docs/contributing.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Contributing
              </h3>
              <p className="text-sm text-muted-foreground">
                Guidelines for contributing code, documentation, and bug
                reports.
              </p>
            </a>

            {/* Infrastructure */}
            <a
              href="/docs/FLUX_CD_MIGRATION.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                Infrastructure
              </h3>
              <p className="text-sm text-muted-foreground">
                GitOps with Flux CD, Docker, and Kubernetes configuration.
              </p>
            </a>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 p-8 bg-card border border-border rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Technology Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js 15 with App Router</li>
                  <li>• React 19 & TypeScript</li>
                  <li>• tRPC for type-safe APIs</li>
                  <li>• Drizzle ORM & PostgreSQL</li>
                  <li>• Tailwind CSS styling</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">DevOps & Cloud</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Kubernetes on GKE</li>
                  <li>• Istio service mesh</li>
                  <li>• Flux CD GitOps</li>
                  <li>• GitHub Actions CI/CD</li>
                  <li>• Cloud SQL PostgreSQL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
