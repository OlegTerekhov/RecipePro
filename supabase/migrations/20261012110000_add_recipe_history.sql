alter table public.recipepro_user_data
  add column if not exists history jsonb not null default '[]'::jsonb;

alter table public.recipepro_user_data
  add constraint recipepro_history_is_array check (jsonb_typeof(history) = 'array');
