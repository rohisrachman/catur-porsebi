"use client";

import { Crown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { ChessBackground } from "@/components/ChessBackground";

function LoginForm() {
  const params = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Passcode admin tidak valid.");
      return;
    }
    window.location.href = params.get("next") ?? "/admin";
  }

  return (
    <ChessBackground>
      <div className="grid min-h-screen place-items-center px-4">
        <form onSubmit={submit} className="royal-frame w-full max-w-md rounded-2xl bg-black/50 p-7 backdrop-blur-xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-royal/60 bg-royal/15 text-royal shadow-gold">
            <Crown size={34} fill="currentColor" />
          </div>
          <h1 className="mt-5 text-center text-3xl font-black uppercase tracking-[0.12em] text-bone">Admin Gate</h1>
          <p className="mt-2 text-center text-sm text-white/50">CATUR PORSEBI control panel</p>
          <input
            type="password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            placeholder="ADMIN_PASSCODE"
            className="mt-6 w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-center text-lg font-bold outline-none focus:border-royal/60"
          />
          {error ? <p className="mt-3 text-center text-sm font-semibold text-red-200">{error}</p> : null}
          <button
            disabled={loading}
            className="mt-5 w-full rounded-xl border border-royal/60 bg-royal/20 px-4 py-3 font-black uppercase tracking-[0.16em] text-amber-100 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter Arena"}
          </button>
        </form>
      </div>
    </ChessBackground>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <ChessBackground>
          <div className="grid min-h-screen place-items-center px-4">
            <div className="glass-panel h-80 w-full max-w-md animate-pulse rounded-2xl" />
          </div>
        </ChessBackground>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
