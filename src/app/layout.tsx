import "./globals.css";
import "highlight.js/styles/github-dark.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio - Full Stack Developer",
  description:
    "Full stack software engineer portfolio featuring modern web development projects and technical blog posts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          <div className="min-h-screen font-sans antialiased">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
