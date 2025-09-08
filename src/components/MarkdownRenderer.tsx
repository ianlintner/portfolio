import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Mermaid } from "@/components/Mermaid";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        // GitHub flavored markdown (tables, strikethrough, task lists)
        remarkPlugins={[remarkGfm]}
        // Syntax highlighting via highlight.js
        rehypePlugins={[rehypeHighlight]}
        // Custom renderers for special cases
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match?.[1]?.toLowerCase();

            if (!inline && language === "mermaid") {
              return <Mermaid chart={String(children).replace(/\n$/, "")} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        // Tailwind Typography styles already applied by parent container
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
