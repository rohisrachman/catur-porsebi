"use client";

import { Crown } from "lucide-react";
import { getPlayerName } from "@/lib/tournamentLogic";
import type { Group, Player } from "@/lib/types";

export function GroupCard({
  group,
  players,
  onRename,
  onWinner
}: {
  group: Group;
  players: Player[];
  onRename: (name: string) => void;
  onWinner: (winnerId?: string) => void;
}) {
  const groupPlayers = group.playerIds.map((id) => players.find((player) => player.id === id)).filter(Boolean) as Player[];

  return (
    <article className="glass-panel rounded-xl p-4">
      <input
        value={group.name}
        onChange={(event) => onRename(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-lg font-black text-amber-100 outline-none focus:border-royal/60"
      />
      <div className="mt-3 space-y-2">
        {groupPlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => onWinner(player.id)}
            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
              group.winnerId === player.id
                ? "border-royal/70 bg-royal/20 text-amber-100"
                : "border-white/10 bg-white/5 text-white/75"
            }`}
          >
            <span className="truncate font-bold">{player.name}</span>
            {group.winnerId === player.id ? <Crown size={16} fill="currentColor" /> : null}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-white/45">Winner: {getPlayerName(players, group.winnerId, "Belum ditentukan")}</p>
    </article>
  );
}
