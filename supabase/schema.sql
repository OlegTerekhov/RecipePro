-- RecipePro cloud data. Run in Supabase Dashboard -> SQL Editor.
-- Each signed-in user can read and change only their own row.

create table if not exists public.recipepro_user_data (
    user_id uuid primary key references auth.users (id) on delete cascade,
    recipes jsonb not null default '[]'::jsonb,
    favorites jsonb not null default '[]'::jsonb,
    meal_plan jsonb not null default '{}'::jsonb,
    shopping_list jsonb not null default '[]'::jsonb,
    history jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default now(),
    constraint recipepro_recipes_is_array check (jsonb_typeof(recipes) = 'array'),
    constraint recipepro_favorites_is_array check (jsonb_typeof(favorites) = 'array'),
    constraint recipepro_meal_plan_is_object check (jsonb_typeof(meal_plan) = 'object'),
    constraint recipepro_shopping_list_is_array check (jsonb_typeof(shopping_list) = 'array'),
    constraint recipepro_history_is_array check (jsonb_typeof(history) = 'array')
);

alter table public.recipepro_user_data enable row level security;

revoke all on table public.recipepro_user_data from anon;
grant select, insert, update, delete on table public.recipepro_user_data to authenticated;

drop policy if exists "Users can read their own RecipePro data" on public.recipepro_user_data;
create policy "Users can read their own RecipePro data"
    on public.recipepro_user_data for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own RecipePro data" on public.recipepro_user_data;
create policy "Users can insert their own RecipePro data"
    on public.recipepro_user_data for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own RecipePro data" on public.recipepro_user_data;
create policy "Users can update their own RecipePro data"
    on public.recipepro_user_data for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own RecipePro data" on public.recipepro_user_data;
create policy "Users can delete their own RecipePro data"
    on public.recipepro_user_data for delete to authenticated
    using ((select auth.uid()) = user_id);


-- Username registry for password-based accounts without an email address.
-- Access is reserved for the trusted Edge Function using the service role key.
create table if not exists public.recipepro_usernames (
    username_normalized text primary key,
    user_id uuid not null unique references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    constraint recipepro_username_format check (username_normalized ~ '^[a-z0-9_]{3,24}$')
);

alter table public.recipepro_usernames enable row level security;
revoke all on table public.recipepro_usernames from anon, authenticated;


-- Username registry is only accessible through the trusted server-side Edge Function.
drop policy if exists recipepro_usernames_no_client_access on public.recipepro_usernames;
create policy recipepro_usernames_no_client_access
    on public.recipepro_usernames
    for all
    to anon, authenticated
    using (false)
    with check (false);

-- Persistent per-user quota for server-side AI generation.
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
