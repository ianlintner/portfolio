"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { ExternalLink, Gamepad2, Rocket } from "lucide-react";

const GameWrapper = dynamic(() => import("@/components/Game/GameWrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[600px] bg-zinc-950 flex items-center justify-center rounded-lg mx-auto text-white">
      Loading Game...
    </div>
  ),
});

const externalGames = [
  {
    title: "Star Freight Tycoon",
    eyebrow: "Standalone strategy sim",
    href: "https://space-tycoon.cat-herding.net/",
    image: "/images/star-freight-tycoon-screenshot.png",
    imageAlt:
      "Star Freight Tycoon playable command deck with a retro sci-fi cargo terminal.",
    description:
      "A turn-driven sci-fi freight management game about building profitable trade routes, assigning ships, and reading the quarterly operating report before the next expansion decision.",
    facts: ["Playable site", "Strategy manual", "Retro command deck"],
  },
];

export default function GamePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-cyan-300/20 bg-[linear-gradient(135deg,#050505_0%,#101018_45%,#160d12_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <section
            aria-labelledby="cat-adventure-title"
            className="rounded-lg border border-cyan-300/20 bg-black/40 p-4 shadow-2xl shadow-cyan-950/40 sm:p-6"
          >
            <div className="mb-5 flex flex-col gap-4 text-left lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
                  <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                  Featured playable
                </div>
                <h1
                  id="cat-adventure-title"
                  className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
                >
                  Cat Adventure
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300">
                  A Phaser roguelite platformer about a determined cat chasing
                  the food bowl through city rooftops, hazards, and powerups.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                WASD / Arrows to move | Space to jump | F to shoot when powered
                up
              </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
              <GameWrapper />
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                More games
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Standalone launches
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
              Smaller experiments, finished sites, and upcoming games can live
              here without displacing the embedded arcade build.
            </p>
          </div>

          <div className="grid gap-6">
            {externalGames.map((game) => (
              <article
                key={game.title}
                className="grid overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/30 lg:grid-cols-[1.25fr_1fr]"
              >
                <a
                  href={game.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block min-h-[240px] bg-black"
                  aria-label={`Open ${game.title}`}
                >
                  <Image
                    src={game.image}
                    alt={game.imageAlt}
                    width={1280}
                    height={720}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="h-full min-h-[240px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 border border-cyan-300/10" />
                </a>

                <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
                      {game.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {game.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-zinc-300">
                      {game.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-2">
                      {game.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>

                    <a
                      href={game.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Play Star Freight Tycoon
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
