"use client";

import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Mail } from "lucide-react";
import { Button, Container, Grid, Section, Divider } from "@ianlintner/theme";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-accent/10 transition-colors">
      <Container>
        <Section className="py-12">
          {/* Main Footer Content */}
          <Grid cols={{ base: 1, md: 4 }} gap={8} className="mb-8">
            {/* About */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Ian Lintner
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Engineering leader and platform architect with 20+ years of
                experience building secure, scalable systems. Passionate about
                mentoring teams and integrating AI into modern workflows.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild aria-label="GitHub">
                  <a
                    href="https://github.com/ianlintner"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiGithub className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  aria-label="LinkedIn"
                >
                  <a
                    href="https://linkedin.com/in/ianlintner/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiLinkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild aria-label="Email">
                  <a href="mailto:lintner.ian@gmail.com">
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Navigate</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demos"
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                    Projects
                  </Link>
                </li>
                <li>{/* Admin link removed for static site */}</li>
              </ul>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="font-semibold mb-4">Specializations</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>• Platform Architecture</li>
                <li>• Cloud Infrastructure</li>
                <li>• AI Integration</li>
                <li>• Team Leadership</li>
                <li>• System Design</li>
              </ul>
            </div>
          </Grid>

          {/* Bottom Bar */}
          <Divider className="my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Ian Lintner. Built with Next.js,
              TypeScript, and ❤️
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/ianlintner/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                View Source
              </a>
            </div>
          </div>
        </Section>
      </Container>
    </footer>
  );
}
