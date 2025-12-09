"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button, NavLink, Container } from "@ianlintner/theme";
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
              <NavLink href="/" active={isActive("/")} onClick={() => window.location.href = "/"}>
                Home
              </NavLink>
              <NavLink href="/blog" active={isActivePrefix("/blog")} onClick={() => window.location.href = "/blog"}>
                Blog
              </NavLink>
              <NavLink href="/docs" active={isActivePrefix("/docs")} onClick={() => window.location.href = "/docs"}>
                Docs
              </NavLink>
              <NavLink href="/demos" active={isActivePrefix("/demos")} onClick={() => window.location.href = "/demos"}>
                Projects
              </NavLink>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcherNav />
            <Button
              variant="ghost"
              size="sm"
              asChild
              aria-label="GitHub"
            >
              <a
                href="https://github.com/ianlintner"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiGithub className="h-5 w-5" />
              </a>
            </Button>
            <Button
              variant="primary"
              size="sm"
              asChild
              glow
            >
              <a
                href="https://linkedin.com/in/ianlintner/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <SiLinkedin className="h-4 w-4" />
                <span>Connect</span>
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top">
            <div className="flex flex-col space-y-3">
              <NavLink href="/" active={isActive("/")} onClick={() => { setMobileMenuOpen(false); window.location.href = "/"; }}>
                Home
              </NavLink>
              <NavLink href="/blog" active={isActivePrefix("/blog")} onClick={() => { setMobileMenuOpen(false); window.location.href = "/blog"; }}>
                Blog
              </NavLink>
              <NavLink href="/docs" active={isActivePrefix("/docs")} onClick={() => { setMobileMenuOpen(false); window.location.href = "/docs"; }}>
                Docs
              </NavLink>
              <NavLink href="/demos" active={isActivePrefix("/demos")} onClick={() => { setMobileMenuOpen(false); window.location.href = "/demos"; }}>
                Projects
              </NavLink>
              <div className="pt-3 border-t flex flex-col space-y-3">
                <ThemeSwitcherNav />
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a
                    href="https://linkedin.com/in/ianlintner/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <SiLinkedin className="h-4 w-4" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </Button>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    aria-label="GitHub"
                  >
                    <a
                      href="https://github.com/ianlintner"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiGithub className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
