export type Round =
  | "group_stage"
  | "round_1"
  | "quarter_finals"
  | "semi_finals"
  | "finals"
  | "third_place";

export type MatchStatus = "not_started" | "ongoing" | "finished";
export type Slot = "player1" | "player2";
export type TournamentStatus = "setup" | "live" | "finished";
export type ConnectionStatus = "live" | "reconnecting" | "offline";

export type Player = {
  id: string;
  name: string;
  groupId: string;
  seedNumber?: number;
  status?: "active" | "eliminated" | "winner";
};

export type Group = {
  id: string;
  name: string;
  playerIds: string[];
  winnerId?: string;
};

export type Match = {
  id: string;
  round: Round;
  matchNumber: number;
  groupId?: string;
  player1Id?: string;
  player2Id?: string;
  player1Name?: string;
  player2Name?: string;
  winnerId?: string;
  loserId?: string;
  status: MatchStatus;
  resultNote?: string;
  nextMatchId?: string;
  nextSlot?: Slot;
  loserNextMatchId?: string;
  loserNextSlot?: Slot;
  updatedAt: string;
};

export type Tournament = {
  id: string;
  name: string;
  slogan: string;
  activeRound: Round;
  status: TournamentStatus;
  displayMode: boolean;
  bracketVersion?: number;
  updatedAt: string;
};

export type TournamentData = {
  tournament: Tournament;
  players: Player[];
  groups: Group[];
  matches: Match[];
};

export type MatchPatch = Partial<Omit<Match, "id">>;
export type PlayerPatch = Partial<Omit<Player, "id">>;
export type GroupPatch = Partial<Omit<Group, "id">>;
export type TournamentPatch = Partial<Omit<Tournament, "id">>;

export const ROUND_LABELS: Record<Round, string> = {
  group_stage: "GROUP STAGE",
  round_1: "ROUND 1",
  quarter_finals: "QUARTER-FINALS",
  semi_finals: "SEMI-FINALS",
  finals: "FINALS",
  third_place: "THIRD PLACE GAME"
};

export const ROUND_ORDER: Round[] = [
  "group_stage",
  "round_1",
  "quarter_finals",
  "semi_finals",
  "finals",
  "third_place"
];
