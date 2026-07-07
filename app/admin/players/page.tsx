"use client";

import { Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ChessBackground } from "@/components/ChessBackground";
import { GroupCard } from "@/components/GroupCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PlayerForm } from "@/components/PlayerForm";
import { ToastStack } from "@/components/ToastStack";
import { useTournamentData } from "@/lib/useTournamentData";

export default function PlayersPage() {
  const actions = useTournamentData();
  const data = actions.data;

  return (
    <ChessBackground>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">Roster & Group</p>
            <h1 className="text-4xl font-black uppercase tracking-[0.08em]">Players</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-bold text-white/70">
            Back to Admin
          </Link>
        </div>

        {data ? (
          <div className="space-y-5">
            <PlayerForm groups={data.groups} onAdd={actions.addPlayer} />
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  players={data.players}
                  onRename={(name) => actions.updateGroup(group.id, { name })}
                  onWinner={(winnerId) => actions.updateGroup(group.id, { winnerId })}
                />
              ))}
            </section>

            <section className="glass-panel rounded-xl p-4">
              <h2 className="text-xl font-black text-amber-100">Player Directory</h2>
              <div className="mt-4 grid gap-2">
                {data.players.map((player) => (
                  <div key={player.id} className="grid gap-2 rounded-xl border border-white/10 bg-black/25 p-3 md:grid-cols-[1fr_220px_auto_auto]">
                    <input
                      value={player.name}
                      onChange={(event) => actions.updatePlayer(player.id, event.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-bold outline-none focus:border-electric/50"
                    />
                    <select
                      value={player.groupId}
                      onChange={(event) => actions.updatePlayer(player.id, player.name, event.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-electric/50"
                    >
                      {data.groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm font-bold text-emerald-100">
                      <Save size={15} />
                      Auto
                    </span>
                    <button
                      onClick={() => actions.deletePlayer(player.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300/25 bg-red-400/10 px-3 py-2 font-bold text-red-100"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <LoadingSkeleton />
        )}
      </div>
      <ToastStack toasts={actions.toasts} />
    </ChessBackground>
  );
}
