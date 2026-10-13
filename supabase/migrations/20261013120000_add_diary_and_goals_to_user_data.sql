alter table public.recipepro_user_data
  add column if not exists food_diary jsonb not null default '{}'::jsonb,
  add column if not exists nutrition_goals jsonb not null default '{}'::jsonb;

alter table public.recipepro_user_data
  drop constraint if exists recipepro_food_diary_is_object,
  add constraint recipepro_food_diary_is_object check (jsonb_typeof(food_diary) = 'object'),
  drop constraint if exists recipepro_nutrition_goals_is_object,
  add constraint recipepro_nutrition_goals_is_object check (jsonb_typeof(nutrition_goals) = 'object');

alter table public.recipepro_user_data enable row level security;
grant select, insert, update, delete on table public.recipepro_user_data to authenticated;
revoke all on table public.recipepro_user_data from anon;
