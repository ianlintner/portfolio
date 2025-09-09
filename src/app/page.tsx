"use client";

import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
                <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  Ian Lintner
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground mb-4 font-light">
                Lead Engineer & Platform Architect
              </p>
              <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                With 20+ years in engineering, I design and build secure,
                cloud-native systems that scale. I specialize in event-driven
                platforms, AI-augmented workflows, and resilient cloud
                infrastructure (AWS, GCP, Kubernetes, Terraform).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/blog"
                className="group inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 h-12 px-8"
              >
                Read My Blog
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demos"
                className="group inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md h-12 px-8"
              >
                View Demos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/ianlintner"
                className="p-3 rounded-full bg-background border border-border hover:border-primary hover:shadow-md transition-all duration-200 group"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/ianlintner/"
                className="p-3 rounded-full bg-background border border-border hover:border-primary hover:shadow-md transition-all duration-200 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 group-hover:text-primary transition-colors" />
              </a>
              <a
                href="mailto:lintner.ian@gmail.com"
                className="p-3 rounded-full bg-background border border-border hover:border-primary hover:shadow-md transition-all duration-200 group"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Technologies Section */}
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Technologies & Expertise
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Specialized in modern web development with a focus on
                performance, scalability, and user experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group p-6 rounded-xl bg-background border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">⚛️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Framer Motion</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-background border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Backend</h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Node.js & tRPC</li>
                  <li>Prisma ORM</li>
                  <li>PostgreSQL</li>
                  <li>NextAuth.js</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-background border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cloud & DevOps</h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Google Cloud Platform</li>
                  <li>Kubernetes & Docker</li>
                  <li>Terraform</li>
                  <li>GitHub Actions</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-background border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Tools & Workflow
                  </h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Git & GitHub</li>
                  <li>VS Code</li>
                  <li>Jest & Testing</li>
                  <li>ArgoCD & GitOps</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  About Me
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    I&apos;m a full stack engineer passionate about building
                    scalable, high-performance applications that balance
                    technical excellence with great user experience. My work
                    spans the full development lifecycle—from intuitive
                    interfaces to resilient backend systems.
                  </p>
                  <p>
                    With deep experience in modern frameworks, cloud platforms,
                    and DevOps practices, I help teams deliver digital
                    experiences that scale with business growth while remaining
                    secure and maintainable.
                  </p>
                  <p>
                    Outside of coding, I share knowledge through writing,
                    mentoring, and contributing to open source—helping grow the
                    next generation of developers.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
                  >
                    Read more about my journey
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="lg:pl-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">
                      5+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">
                      50+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">
                      20+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Blog Posts
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="text-3xl font-bold text-primary mb-2">
                      100%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Client Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-primary/5 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight">
              Let&apos;s Build Something Amazing
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Ready to bring your next project to life? Let&apos;s collaborate
              to create exceptional, human-centered digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg h-12 px-8"
              >
                View My Work
              </Link>
              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
