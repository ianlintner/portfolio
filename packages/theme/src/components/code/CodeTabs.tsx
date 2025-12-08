"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import {
  LANGUAGE_EXTENSIONS,
  LANGUAGE_LABELS,
  useCodeLanguageLocal,
  type CodeLanguage,
} from "../../hooks/useCodeLanguage";
import { Button, type ButtonProps } from "../primitives/Button";
import { CodeBlock } from "./CodeBlock";

export interface CodeTabItem {
  language: CodeLanguage | string;
  code: string;
  label?: string;
  filename?: string;
}

export interface CodeTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of tab definitions */
  tabs: CodeTabItem[];
  /** Persist language selection to cookie/localStorage */
  persist?: boolean;
  /** Default tab language to select */
  defaultLanguage?: string;
  /** Show copy button */
  showCopy?: boolean;
  /** Show line numbers */
  lineNumbers?: boolean;
  /** Wrap long lines */
  wrap?: boolean;
  /** Size for the copy button */
  copyButtonSize?: ButtonProps["size"];
  /** Callback when language changes */
  onLanguageChange?: (lang: string) => void;
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

export function CodeTabs({
  className,
  tabs,
  persist = true,
  defaultLanguage,
  showCopy = true,
  lineNumbers = false,
  wrap = false,
  copyButtonSize = "sm",
  onLanguageChange,
  ...props
}: CodeTabsProps) {
  const fallbackLanguage = defaultLanguage || tabs[0]?.language || "plaintext";
  const { language: persistedLanguage, setLanguage: persistLanguage } =
    useCodeLanguageLocal(fallbackLanguage);

  const [activeLanguage, setActiveLanguage] = useState(fallbackLanguage);
  const [copied, setCopied] = useState(false);

  // Sync with persisted language if enabled
  useEffect(() => {
    if (!persist) return;
    if (
      persistedLanguage &&
      tabs.some((tab) => tab.language === persistedLanguage)
    ) {
      setActiveLanguage(persistedLanguage);
    }
  }, [persist, persistedLanguage, tabs]);

  // Ensure active language always points to an existing tab
  useEffect(() => {
    if (!tabs.length) return;
    if (!tabs.some((tab) => tab.language === activeLanguage)) {
      setActiveLanguage(tabs[0].language);
    }
  }, [tabs, activeLanguage]);

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.language === activeLanguage) || tabs[0];
  }, [tabs, activeLanguage]);

  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
    if (persist) persistLanguage(lang);
    onLanguageChange?.(lang);
  };

  const handleCopy = async () => {
    if (!showCopy || !activeTab) return;
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(activeTab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy code", error);
      setCopied(false);
    }
  };

  const languageLabel =
    LANGUAGE_LABELS[activeTab.language as CodeLanguage] ||
    activeTab.label ||
    activeTab.language;

  const extension =
    LANGUAGE_EXTENSIONS[activeTab.language as CodeLanguage] || "";

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/40 shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-2.5 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.language === activeTab.language;
            return (
              <button
                key={tab.language}
                type="button"
                onClick={() => handleLanguageChange(tab.language)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  "border border-transparent",
                  isActive
                    ? "bg-background text-foreground shadow-sm border-border"
                    : "bg-background/40 text-muted-foreground hover:bg-background/60",
                )}
              >
                {tab.label ||
                  LANGUAGE_LABELS[tab.language as CodeLanguage] ||
                  tab.language}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {(activeTab.filename || extension) && (
            <span className="rounded-md bg-background/60 px-2 py-1 text-foreground">
              {activeTab.filename || `${languageLabel}${extension}`}
            </span>
          )}

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
      </div>

      {activeTab && (
        <CodeBlock
          code={activeTab.code}
          language={activeTab.language}
          filename={activeTab.filename}
          lineNumbers={lineNumbers}
          wrap={wrap}
          showCopy={false}
          hideHeader
          className="rounded-t-none border-0"
        />
      )}
    </div>
  );
}
