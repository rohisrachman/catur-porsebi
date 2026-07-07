import { Crown } from "lucide-react";

export function CrownBadge({ label = "KING" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-royal/60 bg-royal/15 px-2 py-0.5 text-[10px] font-black tracking-[0.2em] text-amber-200 shadow-gold">
      <Crown size={13} fill="currentColor" />
      {label}
    </span>
  );
}
