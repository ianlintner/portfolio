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
