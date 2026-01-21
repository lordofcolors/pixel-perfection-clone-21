-- Remove pin_hash from profiles table (sensitive data should not be client-accessible)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS pin_hash;

-- Create separate table for guardian PINs (no SELECT policy = never exposed to clients)
CREATE TABLE public.guardian_pins (
  id UUID PRIMARY KEY REFERENCES public.guardians(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS with NO SELECT policy (data never leaves server)
ALTER TABLE public.guardian_pins ENABLE ROW LEVEL SECURITY;

-- Only allow guardians to insert/update their own PIN (verified server-side via edge function)
CREATE POLICY "Guardians can insert own PIN"
  ON public.guardian_pins FOR INSERT
  WITH CHECK (id = auth.uid() AND public.has_role(auth.uid(), 'guardian'));

CREATE POLICY "Guardians can update own PIN"
  ON public.guardian_pins FOR UPDATE
  USING (id = auth.uid());

-- Add timestamp trigger
CREATE TRIGGER update_guardian_pins_updated_at
  BEFORE UPDATE ON public.guardian_pins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();