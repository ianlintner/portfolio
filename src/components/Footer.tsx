"use client";

import Link from "next/link";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="border-t bg-gradient-to-b from-background to-accent/10 transition-colors">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto text-center mb-12 pb-12 border-b border-border">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="text-muted-foreground mb-6">
            Get insights on software architecture, cloud platforms, and
            AI-driven development delivered to your inbox.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <span className="font-medium">Thanks for subscribing! 🎉</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
              <a
                href="https://github.com/ianlintner"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="GitHub"
              >
                <SiGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/ianlintner/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:lintner.ian@gmail.com"
                className="p-2.5 rounded-lg bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
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
              <li>
                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                  Admin
                </Link>
              </li>
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
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
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
      </div>
    </footer>
  );
}
