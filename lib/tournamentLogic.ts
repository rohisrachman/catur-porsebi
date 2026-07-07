import { seedData } from "./seedData";
import type { Group, Match, MatchStatus, Player, Round, Slot, TournamentData } from "./types";

const stamp = () => new Date().toISOString();

export function getPlayerName(players: Player[], playerId?: string, fallback = "Awaiting Winner") {
  if (!playerId) return fallback;
  return players.find((player) => player.id === playerId)?.name ?? fallback;
}

export function getRoundMatches(matches: Match[], round: Round) {
  return matches.filter((match) => match.round === round).sort((a, b) => a.matchNumber - b.matchNumber);
}

function writeSlot(match: Match, slot: Slot, playerId?: string, name?: string): Match {
  return {
    ...match,
    [slot === "player1" ? "player1Id" : "player2Id"]: playerId,
    [slot === "player1" ? "player1Name" : "player2Name"]: name ?? "Awaiting Winner",
    winnerId: undefined,
    loserId: undefined,
    status: "not_started",
    updatedAt: stamp()
  };
}

function clearDownstream(matches: Match[], source: Match) {
  let nextId = source.nextMatchId;
  const touched = new Set<string>();
  while (nextId && !touched.has(nextId)) {
    touched.add(nextId);
    const next = matches.find((match) => match.id === nextId);
    if (!next) break;
    const slot = source.nextMatchId === next.id ? source.nextSlot : undefined;
    if (slot) {
      Object.assign(next, writeSlot(next, slot, undefined, "Awaiting Winner"));
    } else {
      next.winnerId = undefined;
      next.loserId = undefined;
      next.status = "not_started";
      next.updatedAt = stamp();
    }
    nextId = next.nextMatchId;
  }
}

export function applySetMatchWinner(data: TournamentData, matchId: string, winnerId: string, resultNote?: string): TournamentData {
  const matches = data.matches.map((match) => ({ ...match }));
  const players = data.players.map((player) => ({ ...player }));
  const groups = data.groups.map((group) => ({ ...group, playerIds: [...group.playerIds] }));
  const match = matches.find((item) => item.id === matchId);
  if (!match) throw new Error("Match tidak ditemukan.");
  if (winnerId !== match.player1Id && winnerId !== match.player2Id) throw new Error("Winner harus salah satu pemain dalam match.");

  const loserId = winnerId === match.player1Id ? match.player2Id : match.player1Id;
  match.winnerId = winnerId;
  match.loserId = loserId;
  match.status = "finished";
  match.resultNote = resultNote ?? match.resultNote;
  match.updatedAt = stamp();

  if (match.round === "group_stage" && match.groupId) {
    const group = groups.find((item) => item.id === match.groupId);
    if (group) group.winnerId = winnerId;
  }

  if (match.nextMatchId && match.nextSlot) {
    const next = matches.find((item) => item.id === match.nextMatchId);
    if (next) Object.assign(next, writeSlot(next, match.nextSlot, winnerId, getPlayerName(players, winnerId)));
  }

  if (match.loserNextMatchId && match.loserNextSlot && loserId) {
    const third = matches.find((item) => item.id === match.loserNextMatchId);
    if (third) Object.assign(third, writeSlot(third, match.loserNextSlot, loserId, getPlayerName(players, loserId)));
  }

  return { ...data, players, groups, matches };
}

export function applyResetMatch(data: TournamentData, matchId: string): TournamentData {
  const matches = data.matches.map((match) => ({ ...match }));
  const groups = data.groups.map((group) => ({ ...group, playerIds: [...group.playerIds] }));
  const match = matches.find((item) => item.id === matchId);
  if (!match) throw new Error("Match tidak ditemukan.");

  match.winnerId = undefined;
  match.loserId = undefined;
  match.status = "not_started";
  match.resultNote = "";
  match.updatedAt = stamp();

  if (match.round === "group_stage" && match.groupId) {
    const group = groups.find((item) => item.id === match.groupId);
    if (group) group.winnerId = undefined;
  }

  clearDownstream(matches, match);
  if (match.loserNextMatchId && match.loserNextSlot) {
    const loserNext = matches.find((item) => item.id === match.loserNextMatchId);
    if (loserNext) Object.assign(loserNext, writeSlot(loserNext, match.loserNextSlot, undefined, "Awaiting Semi-Final Loser"));
  }

  return { ...data, groups, matches };
}

export function applyUpdateMatchStatus(data: TournamentData, matchId: string, status: MatchStatus): TournamentData {
  return {
    ...data,
    matches: data.matches.map((match) =>
      match.id === matchId ? { ...match, status, updatedAt: stamp() } : match
    )
  };
}

export function applySwapMatchPlayers(data: TournamentData, matchId: string): TournamentData {
  return {
    ...data,
    matches: data.matches.map((match) =>
      match.id === matchId
        ? {
            ...match,
            player1Id: match.player2Id,
            player2Id: match.player1Id,
            player1Name: match.player2Name,
            player2Name: match.player1Name,
            updatedAt: stamp()
          }
        : match
    )
  };
}

export function applyUpdatePlayer(data: TournamentData, playerId: string, name: string, groupId?: string): TournamentData {
  const players = data.players.map((player) =>
    player.id === playerId ? { ...player, name, groupId: groupId ?? player.groupId } : player
  );
  const matches = data.matches.map((match) => ({
    ...match,
    player1Name: match.player1Id === playerId ? name : match.player1Name,
    player2Name: match.player2Id === playerId ? name : match.player2Name,
    updatedAt: match.player1Id === playerId || match.player2Id === playerId ? stamp() : match.updatedAt
  }));
  return { ...data, players, matches };
}

export function applyAddPlayer(data: TournamentData, name: string, groupId: string): TournamentData {
  const id = `p-${crypto.randomUUID()}`;
  const player: Player = { id, name, groupId, status: "active" };
  const groups = data.groups.map((group) =>
    group.id === groupId ? { ...group, playerIds: [...group.playerIds, id] } : group
  );
  return { ...data, players: [...data.players, player], groups };
}

export function applyDeletePlayer(data: TournamentData, playerId: string): TournamentData {
  const players = data.players.filter((player) => player.id !== playerId);
  const groups = data.groups.map((group) => ({
    ...group,
    playerIds: group.playerIds.filter((id) => id !== playerId),
    winnerId: group.winnerId === playerId ? undefined : group.winnerId
  }));
  const matches = data.matches.map((match) => ({
    ...match,
    player1Id: match.player1Id === playerId ? undefined : match.player1Id,
    player2Id: match.player2Id === playerId ? undefined : match.player2Id,
    winnerId: match.winnerId === playerId ? undefined : match.winnerId,
    loserId: match.loserId === playerId ? undefined : match.loserId
  }));
  return { ...data, players, groups, matches };
}

export function applyUpdateGroup(data: TournamentData, groupId: string, patch: Partial<Group>): TournamentData {
  return {
    ...data,
    groups: data.groups.map((group) => (group.id === groupId ? { ...group, ...patch } : group))
  };
}

export function computeChampion(data: TournamentData) {
  const final = data.matches.find((match) => match.id === "final");
  return getPlayerName(data.players, final?.winnerId, "");
}

export function computeRunnerUp(data: TournamentData) {
  const final = data.matches.find((match) => match.id === "final");
  return getPlayerName(data.players, final?.loserId, "");
}

export function computeThirdPlace(data: TournamentData) {
  const match = data.matches.find((item) => item.id === "third-place");
  return getPlayerName(data.players, match?.winnerId, "");
}

export function validateBracket(data: TournamentData) {
  const errors: string[] = [];
  data.matches.forEach((match) => {
    if (match.status === "finished" && !match.winnerId) errors.push(`${match.id} finished tanpa winner.`);
    if (match.winnerId && match.winnerId !== match.player1Id && match.winnerId !== match.player2Id) {
      errors.push(`${match.id} winner tidak ada di slot match.`);
    }
  });
  return { valid: errors.length === 0, errors };
}

export function createFreshTournamentData() {
  return seedData;
}
