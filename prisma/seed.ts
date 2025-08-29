import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const adminName = process.env.ADMIN_NAME || 'Admin User'

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  // Create sample tags
  const reactTag = await prisma.tag.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  })

  const nextjsTag = await prisma.tag.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js' },
  })

  const typescriptTag = await prisma.tag.upsert({
    where: { name: 'TypeScript' },
    update: {},
    create: { name: 'TypeScript' },
  })

  console.log('✅ Created sample tags')

  // Create initial blog post: Architecture
  const architecturePost = await prisma.post.upsert({
    where: { slug: 'building-portfolio-architecture' },
    update: {},
    create: {
      title: 'Building This Blog Portfolio Architecture',
      slug: 'building-portfolio-architecture',
      excerpt: 'A breakdown of how this portfolio blog is architected with Next.js App Router, Prisma, tRPC, NextAuth, and Tailwind.',
      content: `
# Building This Blog Portfolio Architecture

This post explains how this very portfolio/blog platform was put together.

## Technology Stack
- **Next.js 14 App Router** for server components
- **TypeScript** for type safety and maintainability
- **Prisma with PostgreSQL** for data modeling
- **tRPC** for end-to-end type safe APIs
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling

## Features
- Content Management System via custom admin panel
- Blog with SEO friendly slugs and metadata
- Component demo gallery
- Authentication with role-based access

Building this took several iterations of database schema design, routing structure, and integrating AI agents for assistance.
      `,
      published: true,
      publishedAt: new Date(),
      seoTitle: 'Building This Portfolio Blog Architecture',
      seoDescription: 'Learn the architecture behind this portfolio blog: Next.js, Prisma, tRPC, NextAuth, Tailwind.',
      seoKeywords: ['portfolio', 'blog', 'Next.js', 'Prisma', 'tRPC', 'architecture'],
      authorId: adminUser.id,
    },
  })

  // Create second blog post: AI Agents
  const aiAgentsPost = await prisma.post.upsert({
    where: { slug: 'ai-agents-cline-roo' },
    update: {},
    create: {
      title: 'Using AI Agent Tools (Cline & Roo) in Development',
      slug: 'ai-agents-cline-roo',
      excerpt: 'An article on how AI-driven tools like Cline and Roo accelerated the development of this site.',
      content: `
# Using AI Agent Tools (Cline & Roo) in Development

During the development of this portfolio blog, I used AI agents such as **Roo** and **Cline** to speed up the process.

## Roo
Roo acted as a system-level developer, able to make structured edits, manage migrations, and coordinate tasks.

## Cline
Cline helped orchestrate multi-step workflows and provided higher-level guidance on development.

## Benefits
- Reduced repetitive coding
- Automated boilerplate scaffolding
- Error checking and guided debugging

## Outcomes
The combination of AI tools allowed me to move faster, focus more on architecture decisions, and get an initial version deployed quickly.
      `,
      published: true,
      publishedAt: new Date(),
      seoTitle: 'Using AI Agent Tools in Development (Cline, Roo)',
      seoDescription: 'Exploring how AI agents like Cline and Roo accelerated building this portfolio blog.',
      seoKeywords: ['AI agents', 'Cline', 'Roo', 'development tools'],
      authorId: adminUser.id,
    },
  })

  // Connect tags to the Architecture post
  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: reactTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: reactTag.id,
    },
  })

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: nextjsTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: nextjsTag.id,
    },
  })

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: architecturePost.id,
        tagId: typescriptTag.id,
      },
    },
    update: {},
    create: {
      postId: architecturePost.id,
      tagId: typescriptTag.id,
    },
  })

  console.log('✅ Created blog posts with tags')

  // Create sample component demo
  const sampleDemo = await prisma.componentDemo.create({
    data: {
      name: 'Interactive Button',
      description: 'A reusable button component with hover effects and multiple variants.',
      code: `
import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded font-medium transition-colors focus:outline-none focus:ring-2',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500': variant === 'outline',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
      `,
      category: 'REACT',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      published: true,
    },
  })

  console.log('✅ Created component demo')


  console.log('🎉 Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
