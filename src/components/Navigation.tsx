"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Container } from "@ianlintner/theme";
import { ThemeSwitcherNav } from "./ThemeSwitcherNav";

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (prefix: string) => pathname?.startsWith(prefix);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 transition-colors shadow-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary transition-all">
                Ian Lintner
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="block">
                <NavLink as="span" active={isActive("/")}>
                  Home
                </NavLink>
              </Link>
              <Link href="/blog" className="block">
                <NavLink as="span" active={isActivePrefix("/blog")}>
                  Blog
                </NavLink>
              </Link>
              <Link href="/docs" className="block">
                <NavLink as="span" active={isActivePrefix("/docs")}>
                  Docs
                </NavLink>
              </Link>
              <Link href="/demos" className="block">
                <NavLink as="span" active={isActivePrefix("/demos")}>
                  Projects
                </NavLink>
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
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <NavLink as="span" active={isActive("/")}>
                  Home
                </NavLink>
              </Link>
              <Link
                href="/blog"
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <NavLink as="span" active={isActivePrefix("/blog")}>
                  Blog
                </NavLink>
              </Link>
              <Link
                href="/docs"
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <NavLink as="span" active={isActivePrefix("/docs")}>
                  Docs
                </NavLink>
              </Link>
              <Link
                href="/demos"
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <NavLink as="span" active={isActivePrefix("/demos")}>
                  Projects
                </NavLink>
              </Link>
              <div className="pt-3 border-t flex flex-col space-y-3">
                <ThemeSwitcherNav />
                <a
                  href="https://linkedin.com/in/ianlintner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 w-full transition-all"
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
      </Container>
    </nav>
  );
}
