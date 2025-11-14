import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Award,
  Calendar,
  Clock,
  Code,
  ExternalLink,
} from "lucide-react";
import { SiGithub, SiLinkedin, SiGmail } from "react-icons/si";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  // Latest demos data (matching the structure from demos page)
  const latestDemos = [
    {
      id: "4",
      title: "Audio Analysis and AI Review Utility in Rust",
      slug: "audio-ai-rust",
      description:
        "A command-line utility written in Rust for analyzing audio and providing AI-powered feedback for guitar practice sessions.",
      technologies: ["Rust", "FFmpeg", "AI"],
      liveUrl: "https://audio-ai.hugecat.net",
    },
    {
      id: "1",
      title: "Interview Data Structures & Algorithms Study App",
      slug: "interview-data-structures-algorithms-study-app",
      description:
        "A comprehensive study app for mastering data structures and algorithms through interactive coding challenges.",
      technologies: ["Python", "Flask"],
      liveUrl: "https://dsa.hugecat.net",
    },
    {
      id: "2",
      title: "Real-time Chat Application",
      slug: "realtime-chat-application",
      description:
        "Full-stack chat application with real-time messaging, user authentication, and message history.",
      technologies: ["Next.js", "Socket.io", "PostgreSQL"],
      liveUrl: "https://chat.hugecat.net",
    },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background py-20 sm:py-28">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">
                  Available for exciting opportunities
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
                <span className="block mb-2">Hi, I&apos;m</span>
                <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  Ian Lintner
                </span>
              </h1>

              <p className="text-2xl sm:text-3xl text-foreground mb-6 font-semibold animate-fade-in">
                Engineering Leader & Platform Architect
              </p>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
                Transforming complex challenges into elegant solutions with 20+
                years of experience. I architect secure, cloud-native platforms
                and mentor high-performing teams to deliver scalable,
                AI-augmented systems that drive real business value.
              </p>

              {/* Key value props */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 text-sm sm:text-base">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-bold text-primary text-xl">20+</span>
                  <span>Years Experience</span>
                </div>
                <div className="hidden sm:block text-border">|</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-bold text-primary text-xl">10+</span>
                  <span>Cloud Technologies</span>
                </div>
                <div className="hidden sm:block text-border">|</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-bold text-primary text-xl">∞</span>
                  <span>Problems Solved</span>
                </div>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <a
                href="https://linkedin.com/in/ianlintner/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 h-14 px-10 w-full sm:w-auto"
              >
                <SiLinkedin className="mr-2 h-5 w-5" />
                Let&apos;s Connect
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/blog"
                className="group inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-2 border-primary/20 bg-background/50 backdrop-blur hover:bg-primary/10 hover:border-primary hover:shadow-lg h-14 px-10 w-full sm:w-auto"
              >
                Explore My Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social proof / Contact links */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
              <p className="text-sm text-muted-foreground">Connect with me:</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/ianlintner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-300 group"
                  aria-label="GitHub"
                >
                  <SiGithub className="h-5 w-5 group-hover:text-primary group-hover:scale-110 transition-all" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ianlintner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-300 group"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-5 w-5 group-hover:text-primary group-hover:scale-110 transition-all" />
                </a>
                <a
                  href="mailto:lintner.ian@gmail.com"
                  className="p-3 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 hover:shadow-lg transition-all duration-300 group"
                  aria-label="Email"
                >
                  <SiGmail className="h-5 w-5 group-hover:text-primary group-hover:scale-110 transition-all" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals / Highlights Section */}
      <section className="py-16 border-y bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">20+</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Years of Experience
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">10+</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Technologies Mastered
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Engineers Mentored
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Commitment to Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Technologies Section */}
      <section className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Technologies & Expertise
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Specialized in modern development with a focus on performance,
                scalability, and delivering measurable business impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">⚛️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Architecture & Platform
                  </h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Event-driven systems & microservices</li>
                  <li>• Secure APIs & LLM agent pipelines</li>
                  <li>• System design & architecture diagrams</li>
                  <li>• Cross-stack collaboration</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Backend & Languages
                  </h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Scala, Java, Python, C#, PHP</li>
                  <li>• JavaScript, TypeScript, SQL</li>
                  <li>• Akka, ZIO, gRPC, Kafka</li>
                  <li>• Functional programming</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Cloud & Infrastructure
                  </h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• AWS & Google Cloud (GCP)</li>
                  <li>• Kubernetes, Terraform, Serverless</li>
                  <li>• CI/CD, Flux, GitOps</li>
                  <li>• Prometheus, Datadog, Sumo Logic</li>
                </ul>
              </div>

              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    AI & Developer Workflow
                  </h3>
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Cline, Roo, GitHub Copilot</li>
                  <li>• Feature Flags & Shadow Deploys</li>
                  <li>• Observability & distributed tracing</li>
                  <li>• Mentorship & design reviews</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with better visual hierarchy */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8"></div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p className="text-xl text-foreground font-medium">
                  I&apos;m an engineering leader and platform architect
                  passionate about building secure, scalable systems that
                  empower teams and accelerate innovation.
                </p>
                <p>
                  My career spans over two decades across startups and
                  enterprise environments, where I&apos;ve led backend
                  transformations, architected event-driven systems, and
                  integrated AI into production workflows. At Carvana, I
                  spearheaded the backend rewrite of the AI communications
                  platform—improving orchestration between LLMs and human
                  agents, and driving adoption of AI-assisted engineering tools.
                </p>
                <p>
                  My technical foundation includes Scala, Python, and
                  cloud-native infrastructure (GCP, AWS, Kubernetes, Terraform).
                  I&apos;m deeply invested in developer experience,
                  observability, and reliability—ensuring systems are not only
                  performant but maintainable and transparent.
                </p>
                <p className="text-foreground font-medium">
                  I also mentor engineers and advocate for AI-augmented
                  development practices that enhance creativity and
                  productivity.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-lg group"
              >
                Read more about my journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-24 bg-accent/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Latest Articles
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Recent insights on software architecture, cloud platforms, and
                  AI-driven development
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>5 min</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="inline-flex items-center text-primary font-medium text-sm group/link">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold border-2 border-primary/30 bg-background hover:bg-primary/10 hover:border-primary rounded-lg transition-all duration-300"
                >
                  View All Articles
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Projects/Demos Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interactive demos and projects showcasing modern development
                techniques
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {latestDemos.map((demo) => (
                <div
                  key={demo.id}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
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

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {demo.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {demo.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {demo.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a
                      href={demo.liveUrl}
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm group/link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/demos"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold border-2 border-primary/30 bg-background hover:bg-primary/10 hover:border-primary rounded-lg transition-all duration-300"
              >
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-t relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Ready to Build Something Exceptional?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Whether you&apos;re looking to scale your platform, architect a
              new system, or bring AI into your workflow—let&apos;s collaborate
              to create impactful solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="https://linkedin.com/in/ianlintner/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:scale-105 h-14 px-10"
              >
                <SiLinkedin className="mr-2 h-5 w-5" />
                Get In Touch on LinkedIn
              </a>
              <Link
                href="/demos"
                className="inline-flex items-center justify-center rounded-lg text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-2 border-primary/30 bg-background hover:bg-primary/10 hover:border-primary h-14 px-10"
              >
                View My Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Additional trust signals */}
            <div className="pt-8 border-t border-border/50 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                I&apos;m currently exploring opportunities in:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 rounded-full bg-background border border-border text-sm">
                  Platform Architecture
                </span>
                <span className="px-4 py-2 rounded-full bg-background border border-border text-sm">
                  Engineering Leadership
                </span>
                <span className="px-4 py-2 rounded-full bg-background border border-border text-sm">
                  AI Integration
                </span>
                <span className="px-4 py-2 rounded-full bg-background border border-border text-sm">
                  Technical Advisory
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
