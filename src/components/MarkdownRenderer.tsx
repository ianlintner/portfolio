import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
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
  // Track if we've encountered the first H1 to skip it (since it's already in the page header)
  let firstH1Skipped = false;

  const components: Components = {
    h1({ children, ...props }) {
      // Skip the first H1 as it's already displayed in the page header
      if (!firstH1Skipped) {
        firstH1Skipped = true;
        return null;
      }
      return <h1 {...props}>{children}</h1>;
    },
    pre({ children, className, ...props }) {
      const child = Array.isArray(children) ? children[0] : children;
      const codeElement = child as unknown as React.ReactElement<{
        className?: string;
        children?: React.ReactNode;
      }>;
      const codeClass = codeElement?.props?.className || "";
      const isMermaid = /language-mermaid/.test(codeClass);

      if (isMermaid) {
        const codeText = String(codeElement.props.children ?? "").replace(
          /\n$/,
          "",
        );
        return (
          <Mermaid
            chart={codeText}
            className="not-prose my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-sm"
          />
        );
      }

      return (
        <pre className={className} {...props}>
          {children}
        </pre>
      );
    },
  };
  return (
    <div className={className}>
      <ReactMarkdown
        // GitHub flavored markdown (tables, strikethrough, task lists)
        remarkPlugins={[remarkGfm]}
        // Syntax highlighting via highlight.js
        rehypePlugins={[rehypeHighlight]}
        // Custom renderers for special cases
        components={components}
        // Tailwind Typography styles already applied by parent container
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
