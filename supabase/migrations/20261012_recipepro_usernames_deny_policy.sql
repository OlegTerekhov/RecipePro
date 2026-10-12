-- Make the intentional absence of direct username-registry access explicit to the linter.
drop policy if exists recipepro_usernames_no_client_access on public.recipepro_usernames;
create policy recipepro_usernames_no_client_access
    on public.recipepro_usernames
    for all
    to anon, authenticated
    using (false)
    with check (false);
