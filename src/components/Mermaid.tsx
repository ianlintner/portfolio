"use client";

import { useEffect, useId, useRef } from "react";

type MermaidProps = {
  chart: string;
  className?: string;
};

export function Mermaid({ chart, className }: MermaidProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      // Lazy-load mermaid only on the client
      const mermaid = (await import("mermaid")).default;

      try {
        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: isDark
            ? {
                fontFamily:
                  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI"',
                primaryColor: "#0ea5e9",
                primaryBorderColor: "#0284c7",
                primaryTextColor: "#e2e8f0",
                lineColor: "#64748b",
                secondaryColor: "#1f2937",
                tertiaryColor: "#0b1220",
                nodeBorder: "#334155",
                clusterBkg: "#111827",
                clusterBorder: "#334155",
              }
            : {
                fontFamily:
                  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI"',
                primaryColor: "#0ea5e9",
                primaryBorderColor: "#0284c7",
                primaryTextColor: "#0f172a",
                lineColor: "#94a3b8",
                secondaryColor: "#f8fafc",
                tertiaryColor: "#ffffff",
                nodeBorder: "#cbd5e1",
                clusterBkg: "#f1f5f9",
                clusterBorder: "#cbd5e1",
              },
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre style="color: var(--foreground)">${
            (e as Error)?.message ?? "Failed to render mermaid diagram"
          }</pre>`;
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return <div ref={containerRef} className={className} />;
}
