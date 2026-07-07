import { MatchCard } from "./MatchCard";
import { ROUND_LABELS, type Match, type Player, type Round } from "@/lib/types";

export function RoundColumn({
  round,
  matches,
  players,
  final = false
}: {
  round: Round;
  matches: Match[];
  players: Player[];
  final?: boolean;
}) {
  return (
    <section className={`flex min-w-[292px] flex-col gap-3 ${final ? "min-w-[340px]" : ""}`}>
      <div className="sticky left-0 z-10 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">{ROUND_LABELS[round]}</p>
        <p className="mt-1 text-sm text-white/45">{matches.length} duel</p>
      </div>
      <div className={`flex flex-col ${final ? "gap-6 pt-10" : "gap-4"}`}>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} players={players} final={final || match.round === "finals"} />
        ))}
      </div>
    </section>
  );
}
