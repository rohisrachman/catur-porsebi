import type { Group, Match, Player, Tournament, TournamentData } from "./types";

export const BRACKET_VERSION = 2;

const now = () => new Date().toISOString();

const groupPairs = [
  ["Group A", "Vito", "Arul"],
  ["Group B", "Agustinus", "Glenn Nathaniel Pandelaki"],
  ["Group C", "Zulkifli", "Rifko"],
  ["Group D", "Topan", "Aspil"],
  ["Group E", "Irfan Azmi", "Habibi"],
  ["Group F", "Fahrul", "Arjuna"],
  ["Group G", "Subryanto", "Andi Tawakal"],
  ["Group H", "Ramadhan", "Moh. Arfan"],
  ["Group I", "Moh. Irsan", "Syamsu"],
  ["Group J", "Arif", "Safa"],
  ["Group K", "Yudi", "Rohis"],
  ["Group L", "Moch. Arif Munandar", "Sukiman"],
  ["Group M", "Ariyo", "Stevin"],
  ["Group N", "Sugeng Priyono", "Darus"]
] as const;

const playerId = (groupIndex: number, slot: 1 | 2) => `p-${String(groupIndex + 1).padStart(2, "0")}-${slot}`;
const groupId = (groupIndex: number) => `group-${String.fromCharCode(97 + groupIndex)}`;

export function createSeedData(): TournamentData {
  const players: Player[] = [];
  const groups: Group[] = [];
  const matches: Match[] = [];

  groupPairs.forEach(([name, player1, player2], index) => {
    const id = groupId(index);
    const p1 = playerId(index, 1);
    const p2 = playerId(index, 2);
    players.push({ id: p1, name: player1, groupId: id, seedNumber: index * 2 + 1, status: "active" });
    players.push({ id: p2, name: player2, groupId: id, seedNumber: index * 2 + 2, status: "active" });
    groups.push({ id, name, playerIds: [p1, p2] });
    matches.push({
      id: `group-${index + 1}`,
      round: "group_stage",
      matchNumber: index + 1,
      groupId: id,
      player1Id: p1,
      player2Id: p2,
      player1Name: player1,
      player2Name: player2,
      status: "not_started",
      nextMatchId: `r1-${Math.floor(index / 2) + 1}`,
      nextSlot: index % 2 === 0 ? "player1" : "player2",
      updatedAt: now()
    });
  });

  for (let i = 1; i <= 7; i += 1) {
    matches.push({
      id: `r1-${i}`,
      round: "round_1",
      matchNumber: i,
      player1Name: "Awaiting Winner",
      player2Name: "Awaiting Winner",
      status: "not_started",
      nextMatchId: `qf-${Math.ceil(i / 2)}`,
      nextSlot: i % 2 === 1 ? "player1" : "player2",
      updatedAt: now()
    });
  }

  for (let i = 1; i <= 4; i += 1) {
    matches.push({
      id: `qf-${i}`,
      round: "quarter_finals",
      matchNumber: i,
      player1Name: "Awaiting Winner",
      player2Name: i === 4 ? "Awaiting Wildcard / Bye" : "Awaiting Winner",
      status: "not_started",
      nextMatchId: `sf-${Math.ceil(i / 2)}`,
      nextSlot: i % 2 === 1 ? "player1" : "player2",
      updatedAt: now()
    });
  }

  for (let i = 1; i <= 2; i += 1) {
    matches.push({
      id: `sf-${i}`,
      round: "semi_finals",
      matchNumber: i,
      player1Name: "Awaiting Winner",
      player2Name: "Awaiting Winner",
      status: "not_started",
      nextMatchId: "final",
      nextSlot: i === 1 ? "player1" : "player2",
      loserNextMatchId: "third-place",
      loserNextSlot: i === 1 ? "player1" : "player2",
      updatedAt: now()
    });
  }

  matches.push(
    {
      id: "final",
      round: "finals",
      matchNumber: 1,
      player1Name: "Awaiting Finalist",
      player2Name: "Awaiting Finalist",
      status: "not_started",
      updatedAt: now()
    },
    {
      id: "third-place",
      round: "third_place",
      matchNumber: 1,
      player1Name: "Awaiting Semi-Final Loser",
      player2Name: "Awaiting Semi-Final Loser",
      status: "not_started",
      updatedAt: now()
    }
  );

  const tournament: Tournament = {
    id: "main",
    name: "CATUR PORSEBI",
    slogan: "#MainkanDiaKINGGG 👑",
    activeRound: "group_stage",
    status: "live",
    displayMode: false,
    bracketVersion: BRACKET_VERSION,
    updatedAt: now()
  };

  return { tournament, players, groups, matches };
}

export const seedData = createSeedData();

export function normalizeTournamentData(data: TournamentData): { data: TournamentData; changed: boolean } {
  const hasCurrentVersion = data.tournament.bracketVersion === BRACKET_VERSION;
  const hasCurrentBracketShape =
    data.matches.some((match) => match.id === "r1-7") &&
    data.matches.some((match) => match.id === "qf-4") &&
    !data.matches.some((match) => match.nextMatchId === "qf-5" || match.nextMatchId === "qf-6");

  if (hasCurrentVersion && hasCurrentBracketShape) return { data, changed: false };

  const fresh = createSeedData();
  return {
    changed: true,
    data: {
      ...fresh,
      tournament: {
        ...fresh.tournament,
        name: data.tournament?.name || fresh.tournament.name,
        slogan: data.tournament?.slogan || fresh.tournament.slogan,
        activeRound: data.tournament?.activeRound || fresh.tournament.activeRound,
        status: data.tournament?.status || fresh.tournament.status,
        displayMode: data.tournament?.displayMode ?? fresh.tournament.displayMode,
        bracketVersion: BRACKET_VERSION,
        updatedAt: now()
      }
    }
  };
}
