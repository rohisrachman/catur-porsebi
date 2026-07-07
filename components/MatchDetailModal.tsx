"use client";

import { Crown, Repeat2, RotateCcw, Swords, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlayerName } from "@/lib/tournamentLogic";
import type { Match, Player } from "@/lib/types";

export function MatchDetailModal({
  match,
  players,
  onClose,
  onWinner,
  onOngoing,
  onReset,
  onSwap
}: {
  match: Match | null;
  players: Player[];
  onClose: () => void;
  onWinner: (matchId: string, winnerId: string, note?: string) => void;
  onOngoing: (matchId: string) => void;
  onReset: (matchId: string) => void;
  onSwap: (matchId: string) => void;
}) {
  const [note, setNote] = useState("");
  const [confirmWinner, setConfirmWinner] = useState<string | null>(null);

  useEffect(() => {
    setNote(match?.resultNote ?? "");
    setConfirmWinner(null);
  }, [match]);

  useEffect(() => {
    if (!match) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "1" && match.player1Id) setConfirmWinner(match.player1Id);
      if (event.key === "2" && match.player2Id) setConfirmWinner(match.player2Id);
      if (event.key.toLowerCase() === "s") onOngoing(match.id);
      if (event.key.toLowerCase() === "r") onReset(match.id);
      if (event.key.toLowerCase() === "w") onSwap(match.id);
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [match, onClose, onOngoing, onReset, onSwap]);

  if (!match) return null;

  const p1 = getPlayerName(players, match.player1Id, match.player1Name);
  const p2 = getPlayerName(players, match.player2Id, match.player2Name);
  const confirmedName = getPlayerName(players, confirmWinner ?? undefined, "");

  const commitWinner = () => {
    if (!confirmWinner) return;
    onWinner(match.id, confirmWinner, note);
    setConfirmWinner(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-4 backdrop-blur-md">
      <div className="royal-frame w-full max-w-4xl overflow-hidden rounded-2xl bg-[#090a10] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">Duel Detail</p>
            <h2 className="text-2xl font-black text-bone">{match.id.toUpperCase()}</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {[
            { label: "White", name: p1, id: match.player1Id, key: "1" },
            { label: "Black", name: p2, id: match.player2Id, key: "2" }
          ].map((player) => (
            <div
              key={player.label}
              className={`rounded-2xl border p-5 text-center ${
                player.id && match.winnerId === player.id
                  ? "border-royal/70 bg-royal/15 shadow-gold"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/45">{player.label}</p>
              <p className="mt-4 min-h-16 text-3xl font-black leading-tight text-bone">{player.name}</p>
              {player.id && match.winnerId === player.id ? (
                <Crown className="mx-auto mt-3 text-royal" size={28} fill="currentColor" />
              ) : null}
              <button
                disabled={!player.id}
                onClick={() => player.id && setConfirmWinner(player.id)}
                className="mt-5 w-full rounded-xl border border-royal/50 bg-royal/15 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Set as Winner ({player.key})
              </button>
            </div>
          ))}

          <div className="order-first grid place-items-center md:order-none">
            <div className="grid h-20 w-20 place-items-center rounded-full border border-electric/50 bg-electric/10 text-sky-100 shadow-electric">
              <Swords size={34} />
            </div>
            <p className="mt-2 text-center text-xs font-black uppercase tracking-[0.25em] text-white/45">VS</p>
          </div>
        </div>

        <div className="border-t border-white/10 p-5">
          <label className="text-xs font-black uppercase tracking-[0.22em] text-white/50">Catatan Hasil</label>
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Menang waktu, skakmat, menyerah, diskualifikasi, remis/tiebreak"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-bone outline-none focus:border-electric/60"
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <button onClick={() => onOngoing(match.id)} className="rounded-xl border border-electric/45 bg-electric/10 px-4 py-3 font-black text-sky-100">
              Mark as Ongoing (S)
            </button>
            <button onClick={() => onSwap(match.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-royal/45 bg-royal/10 px-4 py-3 font-black text-amber-100">
              <Repeat2 size={16} />
              Swap W/B (W)
            </button>
            <button onClick={() => onReset(match.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white/70">
              <RotateCcw size={16} />
              Reset (R)
            </button>
            <button onClick={onClose} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-black text-white/70">
              Close
            </button>
          </div>
        </div>
      </div>

      {confirmWinner ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-royal/50 bg-[#090a10] p-6 shadow-gold">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-royal">Lock Winner</p>
            <h3 className="mt-2 text-2xl font-black text-bone">Kunci {confirmedName} sebagai pemenang?</h3>
            <p className="mt-2 text-sm text-white/55">Sistem akan memajukan pemain ke bracket berikutnya secara otomatis.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmWinner(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white/70">
                Cancel
              </button>
              <button onClick={commitWinner} className="rounded-xl border border-royal/60 bg-royal/20 px-4 py-3 font-black text-amber-100">
                Lock Winner
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
