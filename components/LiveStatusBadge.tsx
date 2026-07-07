"use client";

import { Wifi, WifiOff } from "lucide-react";
import type { ConnectionStatus } from "@/lib/types";

const labels: Record<ConnectionStatus, string> = {
  live: "LIVE",
  reconnecting: "RECONNECTING",
  offline: "OFFLINE"
};

export function LiveStatusBadge({ status }: { status: ConnectionStatus }) {
  const isLive = status === "live";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.24em] ${
        isLive
          ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
          : "border-amber-300/35 bg-amber-400/10 text-amber-100"
      }`}
    >
      {isLive ? <Wifi size={14} /> : <WifiOff size={14} />}
      {labels[status]}
    </span>
  );
}
