alter table public.recipepro_user_data
  add column if not exists meal_plan jsonb not null default '{}'::jsonb,
  add column if not exists shopping_list jsonb not null default '[]'::jsonb;

alter table public.recipepro_user_data
  add constraint recipepro_meal_plan_is_object check (jsonb_typeof(meal_plan) = 'object'),
  add constraint recipepro_shopping_list_is_array check (jsonb_typeof(shopping_list) = 'array');
