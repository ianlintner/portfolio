import "./globals.css";
import "../styles/highlight.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";
import { getAbsoluteUrl, getDefaultSocialImage } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = getAbsoluteUrl("/");
const imageUrl = getDefaultSocialImage();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Portfolio - Full Stack Developer",
  description:
    "Full stack software engineer portfolio featuring modern web development projects and technical blog posts.",
  keywords: [
    "full stack developer",
    "software engineer",
    "web development",
    "React",
    "Next.js",
    "TypeScript",
    "portfolio",
  ],
  authors: [{ name: "Ian Lintner" }],
  creator: "Ian Lintner",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ian Lintner - Full Stack Developer",
    title: "Portfolio - Full Stack Developer",
    description:
      "Full stack software engineer portfolio featuring modern web development projects and technical blog posts.",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Ian Lintner - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Full Stack Developer",
    description:
      "Full stack software engineer portfolio featuring modern web development projects and technical blog posts.",
    creator: "@ianlintner",
    images: [imageUrl],
  },
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
