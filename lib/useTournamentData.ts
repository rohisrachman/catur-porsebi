"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTournamentData, saveTournamentData, subscribeTournamentData } from "./database";
import {
  applyAddPlayer,
  applyDeletePlayer,
  applyResetMatch,
  applySetMatchWinner,
  applySwapMatchPlayers,
  applyUpdateGroup,
  applyUpdateMatchStatus,
  applyUpdatePlayer
} from "./tournamentLogic";
import type { ConnectionStatus, Group, MatchStatus, TournamentData, TournamentPatch } from "./types";

type Toast = { id: string; message: string; type: "success" | "error" | "info" };

export function useTournamentData() {
  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<ConnectionStatus>("reconnecting");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 2600);
  }, []);

  useEffect(() => {
    let mounted = true;
    getTournamentData()
      .then((next) => {
        if (mounted) setData(next);
      })
      .catch(() => {
        if (mounted) pushToast("Gagal memuat data turnamen.", "error");
      })
      .finally(() => mounted && setLoading(false));

    const unsubscribe = subscribeTournamentData(
      (next) => setData(next),
      (status) => setConnection(status)
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [pushToast]);

  const commit = useCallback(
    async (producer: (current: TournamentData) => TournamentData, success: string) => {
      if (!data) return;
      const previous = data;
      const next = producer(previous);
      setData(next);
      try {
        const saved = await saveTournamentData(next);
        setData(saved);
        pushToast(success);
      } catch (error) {
        setData(previous);
        pushToast(error instanceof Error ? error.message : "Gagal menyimpan perubahan.", "error");
      }
    },
    [data, pushToast]
  );

  return useMemo(
    () => ({
      data,
      loading,
      connection,
      toasts,
      setWinner: (matchId: string, winnerId: string, note?: string) =>
        commit((current) => applySetMatchWinner(current, matchId, winnerId, note), "Winner updated."),
      resetMatch: (matchId: string) => commit((current) => applyResetMatch(current, matchId), "Match reset."),
      updateStatus: (matchId: string, status: MatchStatus) =>
        commit((current) => applyUpdateMatchStatus(current, matchId, status), "Match status updated."),
      swapMatchPlayers: (matchId: string) =>
        commit((current) => applySwapMatchPlayers(current, matchId), "White/Black swapped."),
      updatePlayer: (playerId: string, name: string, groupId?: string) =>
        commit((current) => applyUpdatePlayer(current, playerId, name, groupId), "Player updated."),
      addPlayer: (name: string, groupId: string) =>
        commit((current) => applyAddPlayer(current, name, groupId), "Player added."),
      deletePlayer: (playerId: string) =>
        commit((current) => applyDeletePlayer(current, playerId), "Player deleted."),
      updateGroup: (groupId: string, patch: Partial<Group>) =>
        commit((current) => applyUpdateGroup(current, groupId, patch), "Group updated."),
      updateTournament: (patch: TournamentPatch) =>
        commit(
          (current) => ({ ...current, tournament: { ...current.tournament, ...patch, updatedAt: new Date().toISOString() } }),
          "Tournament settings updated."
        ),
      importData: (next: TournamentData) => commit(() => next, "Data imported."),
      resetTournament: (next: TournamentData) => commit(() => next, "Tournament reset."),
      saveRaw: (next: TournamentData, message = "Data saved.") => commit(() => next, message)
    }),
    [commit, connection, data, loading, toasts]
  );
}

export type TournamentActions = ReturnType<typeof useTournamentData>;
