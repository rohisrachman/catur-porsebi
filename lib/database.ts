"use client";

import { createClient, type RealtimeChannel, type SupabaseClient } from "@supabase/supabase-js";
import { normalizeTournamentData, seedData } from "./seedData";
import type { TournamentData } from "./types";

const STORAGE_KEY = "catur-porsebi-preview-data";
const TABLE = "tournament_state";
const ROW_ID = "main";

export type DataListener = (data: TournamentData) => void;

let supabase: SupabaseClient | null = null;

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseClient() {
  if (!hasSupabaseConfig()) return null;
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { realtime: { params: { eventsPerSecond: 10 } } }
    );
  }
  return supabase;
}

function loadPreviewData() {
  if (typeof window === "undefined") return seedData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedData;
  try {
    const normalized = normalizeTournamentData(JSON.parse(raw) as TournamentData);
    if (normalized.changed) savePreviewData(normalized.data);
    return normalized.data;
  } catch {
    return seedData;
  }
}

function savePreviewData(data: TournamentData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("porsebi-preview-change", { detail: data }));
}

export async function getTournamentData(): Promise<TournamentData> {
  const client = getSupabaseClient();
  if (!client) return loadPreviewData();
  const { data, error } = await client.from(TABLE).select("payload").eq("id", ROW_ID).single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data?.payload) {
    await saveTournamentData(seedData);
    return seedData;
  }
  const normalized = normalizeTournamentData(data.payload as TournamentData);
  if (normalized.changed) await saveTournamentData(normalized.data);
  return normalized.data;
}

export async function saveTournamentData(data: TournamentData) {
  const payload: TournamentData = {
    ...data,
    tournament: { ...data.tournament, bracketVersion: seedData.tournament.bracketVersion, updatedAt: new Date().toISOString() }
  };
  const client = getSupabaseClient();
  if (!client) {
    savePreviewData(payload);
    return payload;
  }
  const { error } = await client.from(TABLE).upsert({
    id: ROW_ID,
    payload,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
  return payload;
}

export function subscribeTournamentData(onData: DataListener, onStatus?: (status: "live" | "reconnecting" | "offline") => void) {
  const client = getSupabaseClient();
  let channel: RealtimeChannel | null = null;
  let polling: number | null = null;
  let active = true;

  const poll = async () => {
    try {
      const data = await getTournamentData();
      if (active) {
        onData(data);
        onStatus?.(client ? "reconnecting" : "live");
      }
    } catch {
      onStatus?.("offline");
    }
  };

  if (!client) {
    const listener = (event: Event) => onData((event as CustomEvent<TournamentData>).detail);
    window.addEventListener("porsebi-preview-change", listener);
    window.addEventListener("storage", poll);
    polling = window.setInterval(poll, 8000);
    return () => {
      active = false;
      window.removeEventListener("porsebi-preview-change", listener);
      window.removeEventListener("storage", poll);
      if (polling) window.clearInterval(polling);
    };
  }

  channel = client
    .channel("tournament-state-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE, filter: `id=eq.${ROW_ID}` },
      (payload) => {
        const next = (payload.new as { payload?: TournamentData })?.payload;
        if (next) onData(next);
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") onStatus?.("live");
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onStatus?.("reconnecting");
      if (status === "CLOSED") onStatus?.("offline");
    });

  polling = window.setInterval(poll, 12000);

  return () => {
    active = false;
    if (polling) window.clearInterval(polling);
    if (channel) client.removeChannel(channel);
  };
}

export const supabaseSchemaSql = `
create table if not exists public.tournament_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

alter table public.tournament_state enable row level security;

create policy "public read tournament"
on public.tournament_state for select
using (true);

create policy "anon write tournament during event"
on public.tournament_state for insert
with check (true);

create policy "anon update tournament during event"
on public.tournament_state for update
using (true)
with check (true);
`;
