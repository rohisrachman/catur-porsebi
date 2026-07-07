"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { MatchCard } from "./MatchCard";
import { MatchDetailModal } from "./MatchDetailModal";
import { ROUND_LABELS, ROUND_ORDER, type Match, type Round } from "@/lib/types";
import type { TournamentActions } from "@/lib/useTournamentData";

export function AdminMatchPanel({ actions }: { actions: TournamentActions }) {
  const { data } = actions;
  const [round, setRound] = useState<Round>("group_stage");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Match | null>(null);

  const matches = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.matches
      .filter((match) => match.round === round)
      .filter((match) => {
        if (!q) return true;
        const text = `${match.id} ${match.player1Name ?? ""} ${match.player2Name ?? ""} ${match.resultNote ?? ""}`.toLowerCase();
        return text.includes(q);
      })
      .sort((a, b) => a.matchNumber - b.matchNumber);
  }, [data, query, round]);

  if (!data) return null;

  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
            {ROUND_ORDER.map((item) => (
              <button
                key={item}
                onClick={() => setRound(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  round === item ? "border-royal/60 bg-royal/20 text-amber-100" : "border-white/10 bg-white/5 text-white/55"
                }`}
              >
                {ROUND_LABELS[item]}
              </button>
            ))}
          </div>
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search player/match"
              className="w-full rounded-full border border-white/10 bg-black/35 py-2 pl-9 pr-4 text-sm outline-none focus:border-electric/50"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            players={data.players}
            admin
            onOpen={setSelected}
            onQuickWinner={(item, winnerId) => actions.setWinner(item.id, winnerId)}
            onStart={(item) => actions.updateStatus(item.id, "ongoing")}
            onReset={(item) => actions.resetMatch(item.id)}
            onSwap={(item) => actions.swapMatchPlayers(item.id)}
          />
        ))}
      </div>

      <MatchDetailModal
        match={selected}
        players={data.players}
        onClose={() => setSelected(null)}
        onWinner={actions.setWinner}
        onOngoing={(matchId) => actions.updateStatus(matchId, "ongoing")}
        onReset={actions.resetMatch}
        onSwap={actions.swapMatchPlayers}
      />
    </section>
  );
}
