"use client";

import { useEffect, useRef } from "react";
import { PhaserGame } from "@/game/PhaserGame";

export default function GameWrapper() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      PhaserGame.start();
    }

    return () => {
      PhaserGame.stop();
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={gameRef}
      className="rounded-lg overflow-hidden shadow-2xl mx-auto"
      style={{ width: "800px", height: "600px" }}
    />
  );
}
