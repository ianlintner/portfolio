"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background/90 dark:bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
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
                  isActive("/") ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname?.startsWith("/blog")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Blog
              </Link>
              <Link
                href="/demos"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname?.startsWith("/demos")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Demos
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/ianlintner/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/50 hover:scale-105 motion-safe:animate-pulse hover:animate-none"
              aria-label="View this site's code on GitHub"
            >
              <SiGithub className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">View Code</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground"></span>
              </span>
            </a>
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
  );
}
