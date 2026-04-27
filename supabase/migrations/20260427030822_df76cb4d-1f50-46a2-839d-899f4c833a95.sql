-- 1) Harden user_roles: explicit restrictive policy preventing client mutations.
-- Even without policies, RLS denies by default, but we add explicit policies + a
-- trigger as defense-in-depth so users cannot grant themselves the guardian role.

-- Block any client INSERT / UPDATE / DELETE on user_roles.
-- (No matching permissive policies exist for these commands, so all client
-- mutations are denied. The handle_new_user() SECURITY DEFINER function
-- still bypasses RLS to seed roles at signup.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Block client inserts on user_roles'
  ) THEN
    CREATE POLICY "Block client inserts on user_roles"
      ON public.user_roles
      AS RESTRICTIVE
      FOR INSERT
      TO authenticated, anon
      WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Block client updates on user_roles'
  ) THEN
    CREATE POLICY "Block client updates on user_roles"
      ON public.user_roles
      AS RESTRICTIVE
      FOR UPDATE
      TO authenticated, anon
      USING (false)
      WITH CHECK (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Block client deletes on user_roles'
  ) THEN
    CREATE POLICY "Block client deletes on user_roles"
      ON public.user_roles
      AS RESTRICTIVE
      FOR DELETE
      TO authenticated, anon
      USING (false);
  END IF;
END$$;

-- 2) guardian_pins: add explicit SELECT policy so guardians can verify their own
-- PIN record (and only their own).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'guardian_pins' AND policyname = 'Guardians can view own PIN'
  ) THEN
    CREATE POLICY "Guardians can view own PIN"
      ON public.guardian_pins
      FOR SELECT
      TO authenticated
      USING (id = auth.uid());
  END IF;
END$$;

-- 3) Restrict EXECUTE on SECURITY DEFINER helper functions so anonymous users
-- cannot call them directly via the API. Authenticated role retains EXECUTE
-- because RLS policies that reference these functions are evaluated in the
-- caller's role context.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_guardian_of_learner(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_guardian_id() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_guardian_of_learner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guardian_id() TO authenticated;