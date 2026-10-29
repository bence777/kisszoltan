-- Kiss Zoltán V12 · elkülönített blog, médiatár, ingatlanadat-módosítás és analitika
-- Saját Supabase projekt SQL Editorában futtasd. Nóra meglévő tábláit nem érinti.
create extension if not exists pgcrypto;
create table if not exists public.kz_blog_posts (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 title text not null,excerpt text not null default '',content text not null default '',
 seo_title text not null default '',seo_description text not null default '',focus_keyword text not null default '',
 cover_url text,category_slug text not null default '',tags text[] not null default '{}',
 related_mode text not null default 'auto' check(related_mode in('auto','off','manual')),
 related_ids text[] not null default '{}',related_excluded_ids text[] not null default '{}',
 author_name text not null default 'Kiss Zoltán',
 status text not null default 'draft' check(status in('draft','published')),
 published_at timestamptz,updated_at timestamptz not null default now(),created_at timestamptz not null default now()
);
create index if not exists kz_blog_published_idx on public.kz_blog_posts(status,published_at desc);
create table if not exists public.kz_blog_taxonomy (
 id uuid primary key default gen_random_uuid(),kind text not null check(kind in('tag','category')),
 name text not null,slug text not null,description text not null default '',focus_keyword text not null default '',
 updated_at timestamptz not null default now(),created_at timestamptz not null default now(),unique(kind,slug)
);
create table if not exists public.kz_blog_slug_redirects (
 old_slug text primary key,post_id uuid not null references public.kz_blog_posts(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.kz_blog_revisions (
 id uuid primary key default gen_random_uuid(),post_id uuid not null references public.kz_blog_posts(id) on delete cascade,
 before_data jsonb,changed_by text not null,changed_at timestamptz not null default now()
);
create table if not exists public.kz_property_overrides (
 slug text primary key,title text not null,description text not null,
 price bigint not null check(price>0),status text not null,
 images text[] not null default '{}',updated_at timestamptz not null default now()
);
create table if not exists public.kz_analytics_events (
 id bigint generated always as identity primary key,event_name text not null,
 page_path text not null,property_id text,source_channel text not null default 'direct',
 created_at timestamptz not null default now()
);
create index if not exists kz_analytics_event_created_idx on public.kz_analytics_events(created_at desc);
-- RLS minden táblán: a publikus oldal olvasását is a Next.js API/service_role végzi.
alter table public.kz_blog_posts enable row level security;
alter table public.kz_blog_taxonomy enable row level security;
alter table public.kz_blog_slug_redirects enable row level security;
alter table public.kz_blog_revisions enable row level security;
alter table public.kz_property_overrides enable row level security;
alter table public.kz_analytics_events enable row level security;
-- Külön storage bucketek; publikus média lehet olvasható, privát nem.
insert into storage.buckets(id,name,public,file_size_limit) values
 ('kz-public-media','kz-public-media',true,52428800),
 ('kz-private-media','kz-private-media',false,52428800)
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit;
-- Biztonsági alapértelmezés: a service role a szerveroldali ellenőrzés után ad signed upload tokent.
-- A publikus tároló fájljait Supabase Storage public URL-en szolgálja ki.
