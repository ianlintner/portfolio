"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcherNav } from "./ThemeSwitcherNav";

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 transition-colors shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all">
                Ian Lintner
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors hover:text-primary relative ${
                  isActive("/")
                    ? "text-primary font-semibold"
                    : "text-foreground/70"
                }`}
              >
                Home
                {isActive("/") && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </Link>
              <Link
                href="/blog"
                className={`transition-colors hover:text-primary relative ${
                  pathname?.startsWith("/blog")
                    ? "text-primary font-semibold"
                    : "text-foreground/70"
                }`}
              >
                Blog
                {pathname?.startsWith("/blog") && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </Link>
              <Link
                href="/docs"
                className={`transition-colors hover:text-primary relative ${
                  pathname?.startsWith("/docs")
                    ? "text-primary font-semibold"
                    : "text-foreground/70"
                }`}
              >
                Docs
                {pathname?.startsWith("/docs") && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </Link>
              <Link
                href="/demos"
                className={`transition-colors hover:text-primary relative ${
                  pathname?.startsWith("/demos")
                    ? "text-primary font-semibold"
                    : "text-foreground/70"
                }`}
              >
                Projects
                {pathname?.startsWith("/demos") && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcherNav />
            <a
              href="https://github.com/ianlintner"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/ianlintner/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
              aria-label="Connect on LinkedIn"
            >
              <SiLinkedin className="h-4 w-4" />
              <span>Connect</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive("/")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith("/blog")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/docs"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith("/docs")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="/demos"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname?.startsWith("/demos")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:bg-accent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <div className="pt-3 border-t flex flex-col space-y-3">
                <ThemeSwitcherNav />
                <a
                  href="https://linkedin.com/in/ianlintner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SiLinkedin className="h-4 w-4" />
                  <span>Connect on LinkedIn</span>
                </a>
                <div className="flex items-center justify-center gap-4">
                  <a
                    href="https://github.com/ianlintner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="GitHub"
                  >
                    <SiGithub className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
