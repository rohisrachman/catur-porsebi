"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { Group } from "@/lib/types";

export function PlayerForm({ groups, onAdd }: { groups: Group[]; onAdd: (name: string, groupId: string) => void }) {
  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");

  return (
    <form
      className="glass-panel grid gap-3 rounded-xl p-4 md:grid-cols-[1fr_220px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!name.trim() || !groupId) return;
        onAdd(name.trim(), groupId);
        setName("");
      }}
    >
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nama pemain baru"
        className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-electric/50"
      />
      <select
        value={groupId}
        onChange={(event) => setGroupId(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 outline-none focus:border-electric/50"
      >
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-royal/60 bg-royal/20 px-5 py-3 font-black text-amber-100">
        <Plus size={17} />
        Add
      </button>
    </form>
  );
}
