"use client";

import { Camera, Crown, Maximize2, Minimize2, Shield } from "lucide-react";
import { LiveStatusBadge } from "./LiveStatusBadge";
import type { ConnectionStatus, Tournament } from "@/lib/types";

export function TournamentHeader({
  tournament,
  connection,
  onFullscreen,
  fullscreen,
  onScreenshot
}: {
  tournament: Tournament;
  connection: ConnectionStatus;
  onFullscreen?: () => void;
  fullscreen?: boolean;
  onScreenshot?: () => void;
}) {
  return (
    <header className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-royal/30 bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
          <Shield size={14} />
          Royal Chess Championship
        </div>
        <div className="flex items-center gap-3">
          <LiveStatusBadge status={connection} />
          {onScreenshot ? (
            <button
              onClick={onScreenshot}
              className="inline-flex items-center gap-2 rounded-full border border-royal/40 bg-royal/15 px-3 py-2 text-sm font-semibold text-amber-100 transition hover:border-royal/70 hover:bg-royal/25"
            >
              <Camera size={16} />
              Screenshot
            </button>
          ) : null}
          {onFullscreen ? (
            <button
              onClick={onFullscreen}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-bone transition hover:border-electric/60 hover:bg-electric/10"
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              Display
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-3 text-royal">
            <span className="h-px w-14 bg-royal" />
            <Crown size={28} fill="currentColor" />
          </div>
          <h1 className="text-5xl font-black uppercase leading-none tracking-[0.08em] text-bone drop-shadow-2xl sm:text-7xl lg:text-8xl">
            {tournament.name}
          </h1>
          <p className="mt-4 text-xl font-bold text-amber-100 sm:text-3xl">{tournament.slogan}</p>
        </div>
        <div className="royal-frame rounded-xl bg-black/35 px-5 py-4 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">Active Phase</p>
          <p className="mt-1 text-2xl font-black text-amber-100">{tournament.activeRound.replaceAll("_", " ")}</p>
        </div>
      </div>
    </header>
  );
}
