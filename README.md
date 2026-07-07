# CATUR PORSEBI

Website live bracket turnamen catur berbasis Next.js App Router, TypeScript, Tailwind CSS, dan Supabase Realtime.

## Install

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Environment

Salin `.env.example` menjadi `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_PASSCODE=change-this-passcode
```

`ADMIN_PASSCODE` dipakai server untuk login `/admin/login` dan tidak diekspos ke frontend.

## Supabase

Buat project Supabase online, lalu jalankan SQL ini di SQL Editor:

```sql
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
```

Aktifkan Realtime untuk tabel `tournament_state` dari Supabase dashboard. Aplikasi akan membuat row `id = main` otomatis dari seed data saat pertama dibuka.

Catatan produksi: policy write anon cocok untuk event internal cepat, tetapi untuk deployment publik sebaiknya diganti ke API route server-side atau Supabase Auth khusus admin.

## Halaman

- `/` live public bracket dengan fullscreen/display mode.
- `/admin/login` login operator.
- `/admin` control panel match, quick winner select, status, reset, modal duel, shortcut `1`, `2`, `S`, `R`.
- `/admin/players` player dan group management Group A sampai Group N.
- `/admin/settings` nama turnamen, slogan, fase aktif, display mode, import/export JSON, reset turnamen.

## Deploy ke Vercel

1. Push folder ini ke repository Git.
2. Import project di Vercel.
3. Tambahkan environment variable dari `.env.example`.
4. Deploy.

## Reset Turnamen

Masuk ke `/admin/settings`, klik `Reset Tournament`, lalu konfirmasi. Data akan kembali ke seed awal:
Group A sampai Group N dengan dua pemain per group.
