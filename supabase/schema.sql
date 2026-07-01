create table if not exists public.clients (
  id text primary key,
  name text not null default '',
  short_name text not null default '',
  status text not null default 'Prospect',
  category text not null default '',
  region text not null default '',
  services text not null default '',
  health text not null default 'Stable',
  priority text not null default 'Medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  client_id text not null default '',
  client_name text not null default '',
  name text not null default '',
  bucket text not null default 'Current',
  description text not null default '',
  priority text not null default 'Medium',
  stage text not null default 'Lead / Qualification',
  status text not null default 'Open',
  health text not null default 'Stable',
  owner text not null default 'Unassigned',
  current_ask text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keeps existing pre-rebuild projects tables compatible when this file is run
-- against a database that already had the v1 schema.
alter table public.projects add column if not exists client_id text not null default '';
alter table public.projects add column if not exists client_name text not null default '';
alter table public.projects add column if not exists name text not null default '';
alter table public.projects add column if not exists description text not null default '';
alter table public.projects add column if not exists current_ask text not null default '';

create table if not exists public.project_tasks (
  id text primary key,
  project_id text not null references public.projects(id) on delete cascade,
  title text not null default '',
  status text not null default 'Open',
  owner text not null default 'Unassigned',
  due_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists project_tasks_project_id_idx on public.project_tasks(project_id);
create index if not exists project_tasks_due_date_idx on public.project_tasks(due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public;

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_project_tasks_updated_at on public.project_tasks;
create trigger set_project_tasks_updated_at
before update on public.project_tasks
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;

drop policy if exists "Team can read clients" on public.clients;
create policy "Team can read clients"
on public.clients for select
to authenticated
using (true);

drop policy if exists "Team can insert clients" on public.clients;
create policy "Team can insert clients"
on public.clients for insert
to authenticated
with check (true);

drop policy if exists "Team can update clients" on public.clients;
create policy "Team can update clients"
on public.clients for update
to authenticated
using (true)
with check (true);

drop policy if exists "Team can delete clients" on public.clients;
create policy "Team can delete clients"
on public.clients for delete
to authenticated
using (true);

drop policy if exists "Team can read projects" on public.projects;
create policy "Team can read projects"
on public.projects for select
to authenticated
using (true);

drop policy if exists "Team can insert projects" on public.projects;
create policy "Team can insert projects"
on public.projects for insert
to authenticated
with check (true);

drop policy if exists "Team can update projects" on public.projects;
create policy "Team can update projects"
on public.projects for update
to authenticated
using (true)
with check (true);

drop policy if exists "Team can delete projects" on public.projects;
create policy "Team can delete projects"
on public.projects for delete
to authenticated
using (true);

drop policy if exists "Team can read project tasks" on public.project_tasks;
create policy "Team can read project tasks"
on public.project_tasks for select
to authenticated
using (true);

drop policy if exists "Team can insert project tasks" on public.project_tasks;
create policy "Team can insert project tasks"
on public.project_tasks for insert
to authenticated
with check (true);

drop policy if exists "Team can update project tasks" on public.project_tasks;
create policy "Team can update project tasks"
on public.project_tasks for update
to authenticated
using (true)
with check (true);

drop policy if exists "Team can delete project tasks" on public.project_tasks;
create policy "Team can delete project tasks"
on public.project_tasks for delete
to authenticated
using (true);

grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_tasks to authenticated;
