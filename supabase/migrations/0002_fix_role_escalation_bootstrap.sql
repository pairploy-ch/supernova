-- Fixes prevent_role_escalation() so the very first admin can be bootstrapped
-- via the SQL Editor / service_role key (auth.uid() is null in that context,
-- which the original trigger mistakenly treated as "not an admin").
create or replace function prevent_role_escalation() returns trigger
language plpgsql security definer as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role
     and (select role from profiles where id = auth.uid()) is distinct from 'admin' then
    raise exception 'role change not permitted';
  end if;
  return new;
end;
$$;

-- Promote the seeded admin test account.
update profiles set role = 'admin' where id = 'b958d5ca-1fd4-4ab8-9864-b54bfb654a0b';
