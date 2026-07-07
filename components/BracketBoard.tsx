"use client";

import { ArrowLeft, ArrowRight, Crown, MoveHorizontal, Swords, Trophy } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { computeChampion, computeRunnerUp, computeThirdPlace, getRoundMatches } from "@/lib/tournamentLogic";
import { ROUND_LABELS, type Match, type Round, type TournamentData } from "@/lib/types";

function SplitRoundColumn({
  round,
  matches,
  data,
  side,
  tops
}: {
  round: Round;
  matches: Match[];
  data: TournamentData;
  side: "left" | "right";
  tops: number[];
}) {
  return (
    <section className="flex min-w-[276px] flex-col gap-3">
      <div
        className={`sticky left-0 z-10 rounded-xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl ${
          side === "right" ? "text-right" : ""
        }`}
      >
        <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">{ROUND_LABELS[round]}</p>
        <p className="mt-1 text-sm text-white/45">{matches.length} duel</p>
      </div>
      <div className={`relative h-[1830px] ${side === "right" ? "text-right" : ""}`}>
        {matches.map((match, index) => (
          <div
            key={match.id}
            className={`absolute ${side === "right" ? "right-0" : "left-0"}`}
            style={{ top: tops[index] ?? 0 }}
          >
            <MatchCard match={match} players={data.players} compact final={match.round === "semi_finals"} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FlowConnectors({
  direction,
  groups
}: {
  direction: "left" | "right";
  groups: { from: number[]; to: number }[];
}) {
  return (
    <div className="relative mt-[92px] h-[1830px] w-12 shrink-0">
      {groups.map((group, index) => {
        const min = Math.min(...group.from, group.to);
        const max = Math.max(...group.from, group.to);
        const trunkX = direction === "right" ? 28 : 20;
        const sourceWidth = direction === "right" ? trunkX : 48 - trunkX;
        const targetWidth = direction === "right" ? 48 - trunkX : trunkX;

        return (
          <div key={`${group.to}-${index}`} className="absolute inset-x-0" style={{ top: min, height: max - min }}>
            <div
              className="absolute w-[2px] rounded-full bg-gradient-to-b from-royal/70 via-electric/80 to-royal/70 shadow-electric"
              style={{ left: trunkX, top: 0, height: Math.max(2, max - min) }}
            />
            {group.from.map((center) => (
              <div
                key={center}
                className={`absolute h-[2px] rounded-full bg-gradient-to-r ${
                  direction === "right" ? "from-royal/75 to-electric/80" : "from-electric/80 to-royal/75"
                }`}
                style={{
                  top: center - min,
                  left: direction === "right" ? 0 : trunkX,
                  width: sourceWidth
                }}
              />
            ))}
            <div
              className={`absolute h-[2px] rounded-full bg-gradient-to-r ${
                direction === "right" ? "from-royal/80 to-electric" : "from-electric to-royal/80"
              }`}
              style={{
                top: group.to - min,
                left: direction === "right" ? trunkX : 0,
                width: targetWidth
              }}
            >
            <span
              className={`absolute top-1/2 h-0 w-0 -translate-y-1/2 ${
                direction === "right"
                  ? "-right-1 border-y-[6px] border-l-[9px] border-y-transparent border-l-electric"
                  : "-left-1 border-y-[6px] border-r-[9px] border-y-transparent border-r-electric"
              }`}
            />
          </div>
        </div>
        );
      })}
    </div>
  );
}

export function BracketBoard({ data }: { data: TournamentData }) {
  const champion = computeChampion(data);
  const runnerUp = computeRunnerUp(data);
  const third = computeThirdPlace(data);
  const groupMatches = getRoundMatches(data.matches, "group_stage");
  const roundOneMatches = getRoundMatches(data.matches, "round_1");
  const quarterMatches = getRoundMatches(data.matches, "quarter_finals");
  const semiMatches = getRoundMatches(data.matches, "semi_finals");
  const finalMatch = getRoundMatches(data.matches, "finals");
  const thirdPlaceMatch = getRoundMatches(data.matches, "third_place");

  const leftGroups = groupMatches.slice(0, 8);
  const rightGroups = groupMatches.slice(8);
  const leftRoundOne = roundOneMatches.slice(0, 4);
  const rightRoundOne = roundOneMatches.slice(4);
  const leftQuarters = quarterMatches.slice(0, 2);
  const rightQuarters = quarterMatches.slice(2);
  const leftSemi = semiMatches.slice(0, 1);
  const rightSemi = semiMatches.slice(1);
  const cardHeight = 210;
  const groupTopsLeft = [0, 234, 468, 702, 936, 1170, 1404, 1638];
  const groupTopsRight = [0, 234, 468, 702, 936, 1170];
  const r1TopsLeft = [117, 585, 1053, 1521];
  const r1TopsRight = [117, 585, 1053];
  const qfTopsLeft = [351, 1287];
  const qfTopsRight = [351, 1170];
  const semiTops = [819];
  const centerOf = (top: number) => top + cardHeight / 2;
  const groupCentersLeft = groupTopsLeft.map(centerOf);
  const groupCentersRight = groupTopsRight.map(centerOf);
  const r1CentersLeft = r1TopsLeft.map(centerOf);
  const r1CentersRight = r1TopsRight.map(centerOf);
  const qfCentersLeft = qfTopsLeft.map(centerOf);
  const qfCentersRight = qfTopsRight.map(centerOf);
  const semiCenters = semiTops.map(centerOf);
  const pairConnectorGroups = (sources: number[], targets: number[]) =>
    targets.map((target, index) => ({
      from: sources.slice(index * 2, index * 2 + 2),
      to: target
    }));
  const leftGroupToR1 = pairConnectorGroups(groupCentersLeft, r1CentersLeft);
  const rightGroupToR1 = pairConnectorGroups(groupCentersRight, r1CentersRight);
  const leftR1ToQf = pairConnectorGroups(r1CentersLeft, qfCentersLeft);
  const rightR1ToQf = [
    { from: r1CentersRight.slice(0, 2), to: qfCentersRight[0] },
    { from: [r1CentersRight[2]], to: qfCentersRight[1] }
  ];
  const leftQfToSemi = [{ from: qfCentersLeft, to: semiCenters[0] }];
  const rightQfToSemi = [{ from: qfCentersRight, to: semiCenters[0] }];
  const semiToFinal = [{ from: semiCenters, to: semiCenters[0] }];

  return (
    <section className="mx-auto w-full max-w-[1800px] px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="glass-panel rounded-xl p-5">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-electric">Live Tournament Board</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
            Bracket bergerak dari dua sisi menuju arena final di tengah. Setiap update admin langsung memantul ke layar publik secara realtime.
          </p>
        </div>
        <div className="royal-frame animate-crown-pop rounded-xl bg-black/45 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-royal">Champion Card</p>
              <p className="mt-2 text-2xl font-black text-amber-100">{champion ? `The King: ${champion}` : "Awaiting The King"}</p>
              <p className="mt-1 text-sm text-white/48">
                {runnerUp ? `Runner Up: ${runnerUp}` : third ? `Juara 3: ${third}` : "Final throne masih terbuka."}
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border border-royal/50 bg-royal/15 text-royal shadow-gold">
              {champion ? <Crown size={32} fill="currentColor" /> : <Trophy size={30} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/50 lg:hidden">
        <span>Swipe bracket</span>
        <MoveHorizontal size={18} className="text-royal" />
      </div>

      <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
        <div className="relative flex w-max min-w-full items-stretch justify-start gap-5 pb-2">
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-electric/5 via-royal/60 to-electric/5" />
          <div className="pointer-events-none absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-royal/50 to-transparent" />
          <div className="pointer-events-none absolute left-[43.5%] top-8 hidden rounded-full border border-royal/30 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-royal xl:block">
            <span className="inline-flex items-center gap-2">
              Left Wing <ArrowRight size={13} />
            </span>
          </div>
          <div className="pointer-events-none absolute right-[43.5%] top-8 hidden rounded-full border border-electric/30 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-100 xl:block">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={13} /> Right Wing
            </span>
          </div>

          <div className="flex gap-5">
            <SplitRoundColumn round="group_stage" matches={leftGroups} data={data} side="left" tops={groupTopsLeft} />
            <FlowConnectors direction="right" groups={leftGroupToR1} />
            <SplitRoundColumn round="round_1" matches={leftRoundOne} data={data} side="left" tops={r1TopsLeft} />
            <FlowConnectors direction="right" groups={leftR1ToQf} />
            <SplitRoundColumn round="quarter_finals" matches={leftQuarters} data={data} side="left" tops={qfTopsLeft} />
            <FlowConnectors direction="right" groups={leftQfToSemi} />
            <SplitRoundColumn round="semi_finals" matches={leftSemi} data={data} side="left" tops={semiTops} />
            <FlowConnectors direction="right" groups={semiToFinal} />
          </div>

          <section className="relative z-10 flex min-w-[360px] flex-col justify-center gap-5">
            <div className="royal-frame rounded-2xl bg-gradient-to-b from-royal/20 via-black/55 to-electric/10 p-4 text-center">
              <div className="mb-3 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                Crown Gate
              </div>
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border border-royal/60 bg-black/45 text-royal shadow-gold">
                <Swords size={30} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-royal">Final Arena</p>
              <div className="mt-4">
                {finalMatch.map((match) => (
                  <MatchCard key={match.id} match={match} players={data.players} final />
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-royal/40 bg-black/35 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/45">Crown Reveal</p>
                <p className="mt-2 text-2xl font-black text-amber-100">{champion ? champion : "Awaiting The King"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.24em] text-electric">Bronze Duel</p>
              {thirdPlaceMatch.map((match) => (
                <MatchCard key={match.id} match={match} players={data.players} compact />
              ))}
            </div>
          </section>

          <div className="flex gap-5">
            <FlowConnectors direction="left" groups={semiToFinal} />
            <SplitRoundColumn round="semi_finals" matches={rightSemi} data={data} side="right" tops={semiTops} />
            <FlowConnectors direction="left" groups={rightQfToSemi} />
            <SplitRoundColumn round="quarter_finals" matches={rightQuarters} data={data} side="right" tops={qfTopsRight} />
            <FlowConnectors direction="left" groups={rightR1ToQf} />
            <SplitRoundColumn round="round_1" matches={rightRoundOne} data={data} side="right" tops={r1TopsRight} />
            <FlowConnectors direction="left" groups={rightGroupToR1} />
            <SplitRoundColumn round="group_stage" matches={rightGroups} data={data} side="right" tops={groupTopsRight} />
          </div>
        </div>
      </div>
    </section>
  );
}
