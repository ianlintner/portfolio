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

  // Create sample blog post
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-my-portfolio' },
    update: {},
    create: {
      title: 'Welcome to My Portfolio',
      slug: 'welcome-to-my-portfolio',
      excerpt: 'This is my first blog post on my new portfolio website built with Next.js and TypeScript.',
      content: `
# Welcome to My Portfolio

This is my first blog post on my new portfolio website. I've built this site using modern web technologies including:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Prisma** with PostgreSQL for data management
- **Tailwind CSS** for styling
- **tRPC** for type-safe APIs

## Features

This portfolio includes:

1. A custom CMS for managing content
2. Blog functionality with rich text editing
3. Component demonstrations
4. SEO optimization
5. Responsive design

I'm excited to share more content and showcase my projects here!
      `,
      published: true,
      publishedAt: new Date(),
      seoTitle: 'Welcome to My Portfolio - Full Stack Developer',
      seoDescription: 'Welcome to my portfolio website built with Next.js, TypeScript, and modern web technologies.',
      seoKeywords: ['portfolio', 'web development', 'Next.js', 'TypeScript'],
      authorId: adminUser.id,
    },
  })

  // Connect tags to the post
  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: samplePost.id,
        tagId: nextjsTag.id,
      },
    },
    update: {},
    create: {
      postId: samplePost.id,
      tagId: nextjsTag.id,
    },
  })

  await prisma.postTag.upsert({
    where: {
      postId_tagId: {
        postId: samplePost.id,
        tagId: typescriptTag.id,
      },
    },
    update: {},
    create: {
      postId: samplePost.id,
      tagId: typescriptTag.id,
    },
  })

  console.log('✅ Created sample blog post')

  // Create sample component demo
  const sampleDemo = await prisma.componentDemo.upsert({
    where: { name: 'Interactive Button' },
    update: {},
    create: {
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

  console.log('✅ Created sample component demo')

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
