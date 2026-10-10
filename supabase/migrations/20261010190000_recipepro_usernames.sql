-- RecipePro username/password authentication registry.
-- Only the recipepro-username-auth Edge Function accesses this table with service-role privileges.
create table if not exists public.recipepro_usernames (
    username_normalized text primary key,
    user_id uuid not null unique references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    constraint recipepro_username_format check (username_normalized ~ '^[a-z0-9_]{3,24}$')
);
alter table public.recipepro_usernames enable row level security;
revoke all on table public.recipepro_usernames from anon, authenticated;
