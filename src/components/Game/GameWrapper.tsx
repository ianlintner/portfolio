"use client";

import { useEffect, useRef, useState } from "react";

export default function GameWrapper() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let stop: (() => void) | null = null;

    async function boot() {
      try {
        // Lazy-load the Phaser bootstrap so the initial dynamic import chunk is
        // small and we can surface any load/parse issues cleanly.
        const { PhaserGame } = await import("@/game/PhaserGame");

        if (disposed) return;
        PhaserGame.start();
        stop = () => PhaserGame.stop();
      } catch (err) {
        console.error("Failed to start Phaser game", err);
        if (disposed) return;

        const msg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : "Unknown error";
        setBootError(msg);
      }
    }

    void boot();

    return () => {
      disposed = true;
      try {
        stop?.();
      } catch (err) {
        console.warn("Failed to stop Phaser game", err);
      }
    };
  }, []);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl mx-auto w-[800px] h-[600px]">
      {bootError ? (
        <div className="absolute inset-0 bg-slate-950/90 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-[680px]">
            <div className="text-lg font-semibold">Game failed to start</div>
            <div className="mt-2 text-sm text-slate-300">
              Check the browser console for details.
            </div>
            <div className="mt-3 text-xs text-slate-400 break-words">
              {bootError}
            </div>
          </div>
        </div>
      ) : null}

      <div
        id="game-container"
        ref={gameRef}
        // Canvas defaults to inline and leaves a baseline gap (like an <img>).
        // Force it to block-level so the 800x600 surface fills the wrapper.
        className="w-full h-full [&>canvas]:block"
      />
    </div>
  );
}
