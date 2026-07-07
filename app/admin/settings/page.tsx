"use client";

import { Download, RotateCcw, Upload } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChessBackground } from "@/components/ChessBackground";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ToastStack } from "@/components/ToastStack";
import { createSeedData } from "@/lib/seedData";
import { ROUND_LABELS, ROUND_ORDER, type TournamentData } from "@/lib/types";
import { useTournamentData } from "@/lib/useTournamentData";

export default function SettingsPage() {
  const actions = useTournamentData();
  const data = actions.data;
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  function exportJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `catur-porsebi-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file?: File) {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as TournamentData;
    if (!parsed.tournament || !Array.isArray(parsed.players) || !Array.isArray(parsed.matches)) {
      throw new Error("Format JSON tidak valid.");
    }
    actions.importData(parsed);
  }

  return (
    <ChessBackground>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">Tournament Ops</p>
            <h1 className="text-4xl font-black uppercase tracking-[0.08em]">Settings</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-bold text-white/70">
            Back to Admin
          </Link>
        </div>

        {data ? (
          <div className="space-y-4">
            <section className="glass-panel grid gap-4 rounded-xl p-5">
              <label>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Nama Turnamen</span>
                <input
                  value={data.tournament.name}
                  onChange={(event) => actions.updateTournament({ name: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-xl font-black outline-none focus:border-royal/60"
                />
              </label>
              <label>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Slogan</span>
                <input
                  value={data.tournament.slogan}
                  onChange={(event) => actions.updateTournament({ slogan: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-xl font-black outline-none focus:border-royal/60"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Fase Aktif</span>
                  <select
                    value={data.tournament.activeRound}
                    onChange={(event) => actions.updateTournament({ activeRound: event.target.value as typeof data.tournament.activeRound })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-royal/60"
                  >
                    {ROUND_ORDER.map((round) => (
                      <option key={round} value={round}>
                        {ROUND_LABELS[round]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-end gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
                  <input
                    type="checkbox"
                    checked={data.tournament.displayMode}
                    onChange={(event) => actions.updateTournament({ displayMode: event.target.checked })}
                    className="h-5 w-5 accent-amber-400"
                  />
                  <span className="font-bold text-white/75">Display mode aktif</span>
                </label>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <button onClick={exportJson} className="inline-flex items-center justify-center gap-2 rounded-xl border border-electric/40 bg-electric/10 px-4 py-4 font-black text-sky-100">
                <Download size={18} />
                Export JSON
              </button>
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-4 font-black text-white/75"
              >
                <Upload size={18} />
                Import JSON
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(event) => importJson(event.target.files?.[0]).catch((error) => alert(error.message))}
              />
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-4 font-black text-red-100"
              >
                <RotateCcw size={18} />
                Reset Tournament
              </button>
            </section>

            <section className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm text-amber-100">
              Reset akan mengembalikan semua group, player, match, winner, dan status ke seed awal Group A sampai Group N.
            </section>
          </div>
        ) : (
          <LoadingSkeleton />
        )}
      </div>

      {confirmReset ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-red-300/30 bg-[#090a10] p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-200">Danger Zone</p>
            <h2 className="mt-2 text-2xl font-black text-bone">Reset seluruh turnamen?</h2>
            <p className="mt-2 text-sm text-white/55">Aksi ini akan menghapus hasil pertandingan saat ini dari state online.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmReset(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white/70">
                Cancel
              </button>
              <button
                onClick={() => {
                  actions.resetTournament(createSeedData());
                  setConfirmReset(false);
                }}
                className="rounded-xl border border-red-300/35 bg-red-400/15 px-4 py-3 font-black text-red-100"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ToastStack toasts={actions.toasts} />
    </ChessBackground>
  );
}
