'use client';

import dynamic from 'next/dynamic';

const GameWrapper = dynamic(() => import('@/components/Game/GameWrapper'), {
    ssr: false,
    loading: () => (
        <div className="w-[800px] h-[600px] bg-slate-900 flex items-center justify-center rounded-lg mx-auto text-white">
            Loading Game...
        </div>
    )
});

export default function GamePage() {
    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8 text-center">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Cat Adventure
                    </h1>
                    <p className="mt-4 text-xl text-slate-400">
                        Help the cat find its food bowl! Use Arrow keys to move, Space to jump.
                    </p>
                </div>

                <div className="relative">
                    <GameWrapper />
                </div>

                <div className="text-slate-500 text-sm">
                    <p>Controls: WASD / Arrows to Move • Space to Jump • F to Shoot (when powered up)</p>
                </div>
            </div>
        </div>
    );
}
