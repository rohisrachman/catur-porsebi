"use client";

import { Crown, LogOut, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { AdminMatchPanel } from "@/components/AdminMatchPanel";
import { ChessBackground } from "@/components/ChessBackground";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ToastStack } from "@/components/ToastStack";
import { computeChampion } from "@/lib/tournamentLogic";
import { useTournamentData } from "@/lib/useTournamentData";

export default function AdminPage() {
  const actions = useTournamentData();
  const data = actions.data;

  const stats = data
    ? [
        { label: "Total Players", value: data.players.length, icon: Users },
        { label: "Matches Finished", value: data.matches.filter((match) => match.status === "finished").length, icon: Trophy },
        { label: "Matches Ongoing", value: data.matches.filter((match) => match.status === "ongoing").length, icon: Crown },
        { label: "Champion", value: computeChampion(data) || "Awaiting", icon: Crown }
      ]
    : [];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <ChessBackground>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">Operator Control</p>
            <h1 className="text-4xl font-black uppercase tracking-[0.08em]">Admin Panel</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-bold text-white/70" href="/">
              Public
            </Link>
            <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-bold text-white/70" href="/admin/players">
              Players
            </Link>
            <Link className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-bold text-white/70" href="/admin/settings">
              Settings
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-400/10 px-4 py-2 font-bold text-red-100">
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>

        {data ? (
          <>
            <div className="mb-5 grid gap-3 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-xl p-4">
                  <stat.icon className="text-royal" size={20} />
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
                  <p className="mt-1 truncate text-2xl font-black text-amber-100">{stat.value}</p>
                </div>
              ))}
            </div>
            <AdminMatchPanel actions={actions} />
          </>
        ) : (
          <LoadingSkeleton />
        )}
      </div>
      <ToastStack toasts={actions.toasts} />
    </ChessBackground>
  );
}
