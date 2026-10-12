-- Restrict direct client access and enforce a per-user server-side AI quota.
create table if not exists public.recipepro_ai_usage (
    user_id uuid primary key references auth.users(id) on delete cascade,
    window_started_at timestamptz not null default now(),
    request_count integer not null default 0 check (request_count >= 0),
    updated_at timestamptz not null default now()
);

alter table public.recipepro_ai_usage enable row level security;
revoke all on table public.recipepro_ai_usage from anon, authenticated;
drop policy if exists recipepro_ai_usage_no_client_access on public.recipepro_ai_usage;
create policy recipepro_ai_usage_no_client_access
    on public.recipepro_ai_usage
    for all
    to anon, authenticated
    using (false)
    with check (false);

create or replace function public.recipepro_consume_ai_quota(
    p_user_id uuid,
    p_limit integer default 10,
    p_window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_count integer;
begin
    if p_user_id is null
       or p_limit < 1 or p_limit > 100
       or p_window_seconds < 60 or p_window_seconds > 86400 then
        raise exception 'Invalid AI quota parameters';
    end if;

    insert into public.recipepro_ai_usage (user_id, window_started_at, request_count, updated_at)
    values (p_user_id, pg_catalog.now(), 1, pg_catalog.now())
    on conflict (user_id) do update
    set
        window_started_at = case
            when public.recipepro_ai_usage.window_started_at
                <= pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds)
            then pg_catalog.now()
            else public.recipepro_ai_usage.window_started_at
        end,
        request_count = case
            when public.recipepro_ai_usage.window_started_at
                <= pg_catalog.now() - pg_catalog.make_interval(secs => p_window_seconds)
            then 1
            else public.recipepro_ai_usage.request_count + 1
        end,
        updated_at = pg_catalog.now()
    returning request_count into current_count;

    return current_count <= p_limit;
end;
$$;

revoke all on function public.recipepro_consume_ai_quota(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.recipepro_consume_ai_quota(uuid, integer, integer) to service_role;
