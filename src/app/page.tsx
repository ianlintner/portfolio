export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Full Stack
            <span className="text-primary"> Developer</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Building modern web applications with React, Next.js, TypeScript, and cloud technologies.
            Passionate about creating scalable solutions and great user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Read My Blog
            </a>
            <a
              href="/demos"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              View Demos
            </a>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">Technologies & Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold">Frontend</h3>
              <p className="text-sm text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Backend</h3>
              <p className="text-sm text-muted-foreground">Node.js, tRPC, Prisma, PostgreSQL</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Cloud</h3>
              <p className="text-sm text-muted-foreground">Google Cloud, Kubernetes, Docker</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">DevOps</h3>
              <p className="text-sm text-muted-foreground">CI/CD, GitHub Actions, ArgoCD</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a passionate full stack developer with expertise in modern web technologies.
              I love building scalable applications, writing clean code, and sharing knowledge
              through technical blog posts and open source contributions.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
