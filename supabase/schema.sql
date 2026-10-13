-- RecipePro cloud data. Run in Supabase Dashboard -> SQL Editor.
-- Each signed-in user can read and change only their own row.

create table if not exists public.recipepro_user_data (
    user_id uuid primary key references auth.users (id) on delete cascade,
    recipes jsonb not null default '[]'::jsonb,
    favorites jsonb not null default '[]'::jsonb,
    meal_plan jsonb not null default '{}'::jsonb,
    shopping_list jsonb not null default '[]'::jsonb,
    history jsonb not null default '[]'::jsonb,
    food_diary jsonb not null default '{}'::jsonb,
    nutrition_goals jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now(),
    constraint recipepro_recipes_is_array check (jsonb_typeof(recipes) = 'array'),
    constraint recipepro_favorites_is_array check (jsonb_typeof(favorites) = 'array'),
    constraint recipepro_meal_plan_is_object check (jsonb_typeof(meal_plan) = 'object'),
    constraint recipepro_shopping_list_is_array check (jsonb_typeof(shopping_list) = 'array'),
    constraint recipepro_history_is_array check (jsonb_typeof(history) = 'array'),
    constraint recipepro_food_diary_is_object check (jsonb_typeof(food_diary) = 'object'),
    constraint recipepro_nutrition_goals_is_object check (jsonb_typeof(nutrition_goals) = 'object')
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


-- Public community: profile fields are separate from private account data.
create table if not exists public.recipepro_public_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    username text,
    display_name text not null default '',
    bio text not null default '',
    avatar_path text,
    is_public boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint recipepro_public_profiles_username_length check (username is null or char_length(username) between 3 and 24),
    constraint recipepro_public_profiles_display_name_length check (char_length(display_name) <= 50),
    constraint recipepro_public_profiles_bio_length check (char_length(bio) <= 240)
);

create unique index if not exists recipepro_public_profiles_username_unique
    on public.recipepro_public_profiles (lower(username))
    where username is not null and username <> '';

create table if not exists public.recipepro_public_recipes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    source_id text,
    title text not null,
    description text not null default '',
    image_path text,
    ingredients jsonb not null default '[]'::jsonb,
    nutrition jsonb not null default '{}'::jsonb,
    is_published boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint recipepro_public_recipes_title_length check (char_length(title) between 1 and 120),
    constraint recipepro_public_recipes_description_length check (char_length(description) <= 3000),
    constraint recipepro_public_recipes_ingredients_array check (jsonb_typeof(ingredients) = 'array'),
    constraint recipepro_public_recipes_nutrition_object check (jsonb_typeof(nutrition) = 'object')
);

create unique index if not exists recipepro_public_recipes_owner_source_unique
    on public.recipepro_public_recipes (user_id, source_id);
create index if not exists recipepro_public_recipes_feed_idx
    on public.recipepro_public_recipes (is_published, created_at desc);
create index if not exists recipepro_public_recipes_owner_idx
    on public.recipepro_public_recipes (user_id, updated_at desc);

alter table public.recipepro_public_profiles enable row level security;
alter table public.recipepro_public_recipes enable row level security;

drop policy if exists "Public profiles are visible to everyone" on public.recipepro_public_profiles;
create policy "Public profiles are visible to everyone"
    on public.recipepro_public_profiles for select to anon, authenticated
    using (is_public = true or (select auth.uid()) = user_id);
drop policy if exists "Users insert their own public profile" on public.recipepro_public_profiles;
create policy "Users insert their own public profile"
    on public.recipepro_public_profiles for insert to authenticated
    with check ((select auth.uid()) = user_id);
drop policy if exists "Users update their own public profile" on public.recipepro_public_profiles;
create policy "Users update their own public profile"
    on public.recipepro_public_profiles for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete their own public profile" on public.recipepro_public_profiles;
create policy "Users delete their own public profile"
    on public.recipepro_public_profiles for delete to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Published recipes are visible to everyone" on public.recipepro_public_recipes;
create policy "Published recipes are visible to everyone"
    on public.recipepro_public_recipes for select to anon, authenticated
    using (is_published = true or (select auth.uid()) = user_id);
drop policy if exists "Users create their own public recipes" on public.recipepro_public_recipes;
create policy "Users create their own public recipes"
    on public.recipepro_public_recipes for insert to authenticated
    with check ((select auth.uid()) = user_id);
drop policy if exists "Users update their own public recipes" on public.recipepro_public_recipes;
create policy "Users update their own public recipes"
    on public.recipepro_public_recipes for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete their own public recipes" on public.recipepro_public_recipes;
create policy "Users delete their own public recipes"
    on public.recipepro_public_recipes for delete to authenticated
    using ((select auth.uid()) = user_id);

grant select on public.recipepro_public_profiles to anon, authenticated;
grant insert, update, delete on public.recipepro_public_profiles to authenticated;
grant select on public.recipepro_public_recipes to anon, authenticated;
grant insert, update, delete on public.recipepro_public_recipes to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipepro-public-media', 'recipepro-public-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "RecipePro users upload media to their own folder" on storage.objects;
create policy "RecipePro users upload media to their own folder"
    on storage.objects for insert to authenticated
    with check (bucket_id = 'recipepro-public-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "RecipePro users view their own media objects" on storage.objects;
create policy "RecipePro users view their own media objects"
    on storage.objects for select to authenticated
    using (bucket_id = 'recipepro-public-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "RecipePro users update their own media objects" on storage.objects;
create policy "RecipePro users update their own media objects"
    on storage.objects for update to authenticated
    using (bucket_id = 'recipepro-public-media' and (storage.foldername(name))[1] = (select auth.uid())::text)
    with check (bucket_id = 'recipepro-public-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "RecipePro users delete their own media objects" on storage.objects;
create policy "RecipePro users delete their own media objects"
    on storage.objects for delete to authenticated
    using (bucket_id = 'recipepro-public-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
