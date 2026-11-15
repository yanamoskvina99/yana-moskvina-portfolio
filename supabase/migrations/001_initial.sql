-- YM CMS schema: run in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- Profiles (admin flag)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- JSON sections (hero, about, contacts, seo, intros, marquee, settings)
create table if not exists public.site_sections (
  key text primary key,
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Collection tables
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  draft jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  draft jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.prices (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  draft jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_published boolean not null default true,
  draft jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.faq (
  id uuid primary key default gen_random_uuid(),
  question text not null default '',
  answer text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  filename text not null,
  mime text,
  size_bytes bigint,
  alt text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- RLS
alter table public.site_sections enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.prices enable row level security;
alter table public.steps enable row level security;
alter table public.faq enable row level security;
alter table public.media enable row level security;
alter table public.revisions enable row level security;

-- Profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

-- Sections: public reads published via select all rows (client uses published field)
create policy "sections_public_read" on public.site_sections
  for select using (true);
create policy "sections_admin_all" on public.site_sections
  for all using (public.is_admin()) with check (public.is_admin());

-- Collections: public can read published rows
create policy "services_public_read" on public.services
  for select using (is_published = true or public.is_admin());
create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "projects_public_read" on public.projects
  for select using (is_published = true or public.is_admin());
create policy "projects_admin_all" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

create policy "prices_public_read" on public.prices
  for select using (is_published = true or public.is_admin());
create policy "prices_admin_all" on public.prices
  for all using (public.is_admin()) with check (public.is_admin());

create policy "steps_public_read" on public.steps
  for select using (is_published = true or public.is_admin());
create policy "steps_admin_all" on public.steps
  for all using (public.is_admin()) with check (public.is_admin());

create policy "faq_public_read" on public.faq
  for select using (is_published = true or public.is_admin());
create policy "faq_admin_all" on public.faq
  for all using (public.is_admin()) with check (public.is_admin());

create policy "media_public_read" on public.media
  for select using (true);
create policy "media_admin_all" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

create policy "revisions_admin_read" on public.revisions
  for select using (public.is_admin());
create policy "revisions_admin_insert" on public.revisions
  for insert with check (public.is_admin());

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_storage_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_storage_admin_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

create policy "media_storage_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
