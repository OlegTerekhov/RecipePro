-- RecipePro cloud data. Run in Supabase Dashboard -> SQL Editor.
-- Each signed-in user can read and change only their own row.

create table if not exists public.recipepro_user_data (
    user_id uuid primary key references auth.users (id) on delete cascade,
    recipes jsonb not null default '[]'::jsonb,
    favorites jsonb not null default '[]'::jsonb,
    updated_at timestamptz not null default now(),
    constraint recipepro_recipes_is_array check (jsonb_typeof(recipes) = 'array'),
    constraint recipepro_favorites_is_array check (jsonb_typeof(favorites) = 'array')
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
