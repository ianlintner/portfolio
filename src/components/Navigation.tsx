'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">Portfolio</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname?.startsWith('/blog') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/demos"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname?.startsWith('/demos') ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Demos
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-foreground/60 hover:text-foreground/80 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
