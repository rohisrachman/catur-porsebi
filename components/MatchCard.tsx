"use client";

import { Clock, Repeat2, RotateCcw, Swords } from "lucide-react";
import { CrownBadge } from "./CrownBadge";
import { getPlayerName } from "@/lib/tournamentLogic";
import type { Match, Player } from "@/lib/types";

export function MatchCard({
  match,
  players,
  compact = false,
  final = false,
  admin = false,
  onOpen,
  onQuickWinner,
  onStart,
  onReset,
  onSwap
}: {
  match: Match;
  players: Player[];
  compact?: boolean;
  final?: boolean;
  admin?: boolean;
  onOpen?: (match: Match) => void;
  onQuickWinner?: (match: Match, winnerId: string) => void;
  onStart?: (match: Match) => void;
  onReset?: (match: Match) => void;
  onSwap?: (match: Match) => void;
}) {
  const p1 = getPlayerName(players, match.player1Id, match.player1Name);
  const p2 = getPlayerName(players, match.player2Id, match.player2Name);
  const ongoing = match.status === "ongoing";
  const finished = match.status === "finished";

  const row = (slot: "player1" | "player2", name: string, id?: string) => {
    const winner = id && match.winnerId === id;
    const loser = finished && id && match.loserId === id;
    return (
      <button
        type="button"
        disabled={!admin || !id}
        onClick={(event) => {
          event.stopPropagation();
          if (admin && id) onQuickWinner?.(match, id);
        }}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition ${
          winner
            ? "border-royal/70 bg-royal/20 text-amber-100 shadow-gold"
            : loser
              ? "border-white/5 bg-black/20 text-white/45"
              : "border-white/10 bg-white/[0.045] text-bone hover:border-electric/40"
        } ${admin && id ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold sm:text-base">{name || "Awaiting Winner"}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{slot === "player1" ? "White" : "Black"}</span>
        </span>
        {winner ? <CrownBadge label="WIN" /> : null}
      </button>
    );
  };

  return (
    <article
      onClick={() => onOpen?.(match)}
      className={`glass-panel relative overflow-hidden rounded-xl p-3 transition ${
        final ? "royal-frame w-[300px] scale-[1.01] bg-royal/10" : compact ? "w-[250px]" : "w-[260px]"
      } ${ongoing ? "animate-slow-pulse border-electric/40" : ""} ${onOpen ? "cursor-pointer hover:-translate-y-0.5 hover:border-royal/45" : ""}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/80 to-transparent" />
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Match {match.matchNumber}</p>
          <p className={`truncate font-black uppercase tracking-[0.16em] ${final ? "text-amber-100" : "text-white/75"} ${compact ? "text-xs" : "text-sm"}`}>
            {match.groupId ? match.groupId.replace("group-", "Group ").toUpperCase() : match.id}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
            ongoing
              ? "border-electric/50 bg-electric/10 text-sky-100"
              : finished
                ? "border-royal/50 bg-royal/15 text-amber-100"
                : "border-white/10 bg-white/5 text-white/55"
          }`}
        >
          {ongoing ? <Swords size={12} /> : <Clock size={12} />}
          {match.status.replace("_", " ")}
        </span>
      </div>
      <div className="space-y-2">
        {row("player1", p1, match.player1Id)}
        {row("player2", p2, match.player2Id)}
      </div>
      {match.resultNote ? <p className="mt-3 rounded-lg bg-black/25 px-3 py-2 text-xs text-white/60">{match.resultNote}</p> : null}
      {admin ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onStart?.(match);
            }}
            className="rounded-lg border border-electric/35 bg-electric/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-sky-100"
          >
            Start
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSwap?.(match);
            }}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-royal/35 bg-royal/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-100"
          >
            <Repeat2 size={13} />
            Swap
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onReset?.(match);
            }}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/70"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      ) : null}
    </article>
  );
}
