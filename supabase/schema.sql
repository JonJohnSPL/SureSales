create table if not exists public.projects (
  id text primary key,
  client text not null default '',
  workstream text not null default '',
  bucket text not null default '',
  duration text not null default '',
  ask text not null default '',
  owner text not null default 'Unassigned',
  priority text not null default 'Medium',
  stage text not null default 'Qualification',
  status text not null default 'Open',
  health text not null default 'Yellow',
  next_step text not null default '',
  due_date date,
  hard_date boolean not null default false,
  recurring boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.target_accounts (
  client text primary key,
  next_move text not null default '',
  wedge text not null default '',
  status text not null default '',
  type text not null default 'Prospect',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_target_accounts_updated_at on public.target_accounts;
create trigger set_target_accounts_updated_at
before update on public.target_accounts
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.target_accounts enable row level security;

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

drop policy if exists "Team can read target accounts" on public.target_accounts;
create policy "Team can read target accounts"
on public.target_accounts for select
to authenticated
using (true);

drop policy if exists "Team can insert target accounts" on public.target_accounts;
create policy "Team can insert target accounts"
on public.target_accounts for insert
to authenticated
with check (true);

drop policy if exists "Team can update target accounts" on public.target_accounts;
create policy "Team can update target accounts"
on public.target_accounts for update
to authenticated
using (true)
with check (true);

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update on public.target_accounts to authenticated;
