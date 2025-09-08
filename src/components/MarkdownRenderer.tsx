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
  const components: Components = {
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
