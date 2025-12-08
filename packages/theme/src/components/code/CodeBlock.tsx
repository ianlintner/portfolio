"use client";

import React, { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import {
  LANGUAGE_LABELS,
  type CodeLanguage,
} from "../../hooks/useCodeLanguage";
import { Button, type ButtonProps } from "../primitives/Button";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source code to display */
  code: string;
  /** Language identifier (used for labels and className) */
  language?: CodeLanguage | string;
  /** Optional filename to show in the header */
  filename?: string;
  /** Show copy-to-clipboard button */
  showCopy?: boolean;
  /** Show line numbers alongside code */
  lineNumbers?: boolean;
  /** Wrap long lines instead of horizontal scrolling */
  wrap?: boolean;
  /** Hide the top chrome (title + copy) */
  hideHeader?: boolean;
  /** Size for the copy button */
  copyButtonSize?: ButtonProps["size"];
}

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function CodeBlock({
  className,
  code,
  language,
  filename,
  showCopy = true,
  lineNumbers = false,
  wrap = false,
  hideHeader = false,
  copyButtonSize = "sm",
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const displayLanguage = language || "plaintext";
  const languageLabel = useMemo(() => {
    return LANGUAGE_LABELS[displayLanguage as CodeLanguage] || displayLanguage;
  }, [displayLanguage]);

  const lines = useMemo(() => {
    // Preserve trailing empty lines by avoiding trim
    return code.split("\n");
  }, [code]);

  const handleCopy = async () => {
    if (!navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy code", error);
      setCopied(false);
    }
  };

  return (
    <div
      className={cn(
        "group/code rounded-xl border border-border/60 bg-muted/40 shadow-sm",
        className,
      )}
      {...props}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="rounded-md bg-background/60 px-2 py-1 font-medium text-foreground">
                {filename}
              </span>
            )}
            <span className="rounded-full bg-background/50 px-2 py-1 text-[11px] uppercase tracking-wide">
              {languageLabel}
            </span>
          </div>
          {showCopy && (
            <Button
              type="button"
              variant="ghost"
              size={copyButtonSize}
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              aria-label="Copy code to clipboard"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <pre
          className={cn(
            "relative m-0 flex min-h-[48px] gap-4 px-4 py-3 text-sm text-foreground",
            "font-mono leading-6",
            wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
          )}
        >
          {lineNumbers && (
            <code
              aria-hidden
              className="select-none pr-3 text-right text-xs text-muted-foreground/70"
            >
              {lines.map((_, index) => (
                <div key={`line-number-${index}`}>{index + 1}</div>
              ))}
            </code>
          )}

          <code
            className={cn(
              "flex-1",
              wrap && "whitespace-pre-wrap break-words",
              `language-${displayLanguage}`,
            )}
          >
            {lines.map((line, index) => (
              <div key={`code-line-${index}`}>{line || "\u00A0"}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
