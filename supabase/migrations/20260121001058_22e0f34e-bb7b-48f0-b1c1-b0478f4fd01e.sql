-- Create role enum
CREATE TYPE public.app_role AS ENUM ('guardian', 'learner');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role app_role NOT NULL,
  pin_hash TEXT, -- For guardians only, hashed PIN
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for role-based access (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create guardians table
CREATE TABLE public.guardians (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create learners table (linked to guardian)
CREATE TABLE public.learners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_locked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID REFERENCES public.learners(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(learner_id, lesson_id)
);

-- Create conversations table for AI chat
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID REFERENCES public.learners(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table for conversation history
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('learner', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get guardian ID for current user
CREATE OR REPLACE FUNCTION public.get_guardian_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.guardians WHERE id = auth.uid()
$$;

-- Function to check if user is guardian of a learner
CREATE OR REPLACE FUNCTION public.is_guardian_of_learner(_learner_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.learners
    WHERE id = _learner_id
      AND guardian_id = auth.uid()
  )
$$;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- USER_ROLES POLICIES (users can only read their own roles)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- GUARDIANS POLICIES
CREATE POLICY "Guardians can view own record"
  ON public.guardians FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Guardians can insert own record"
  ON public.guardians FOR INSERT
  WITH CHECK (auth.uid() = id AND public.has_role(auth.uid(), 'guardian'));

-- LEARNERS POLICIES
CREATE POLICY "Guardians can view their learners"
  ON public.learners FOR SELECT
  USING (guardian_id = auth.uid() OR user_id = auth.uid());

CREATE POLICY "Guardians can insert learners"
  ON public.learners FOR INSERT
  WITH CHECK (guardian_id = auth.uid() AND public.has_role(auth.uid(), 'guardian'));

CREATE POLICY "Guardians can update their learners"
  ON public.learners FOR UPDATE
  USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can delete their learners"
  ON public.learners FOR DELETE
  USING (guardian_id = auth.uid());

-- SKILLS POLICIES
CREATE POLICY "Guardians can view own skills"
  ON public.skills FOR SELECT
  USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can insert skills"
  ON public.skills FOR INSERT
  WITH CHECK (guardian_id = auth.uid() AND public.has_role(auth.uid(), 'guardian'));

CREATE POLICY "Guardians can update own skills"
  ON public.skills FOR UPDATE
  USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can delete own skills"
  ON public.skills FOR DELETE
  USING (guardian_id = auth.uid());

-- LESSONS POLICIES
CREATE POLICY "Guardians can view own lessons"
  ON public.lessons FOR SELECT
  USING (guardian_id = auth.uid());

CREATE POLICY "Learners can view assigned lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.learners l ON l.id = a.learner_id
      WHERE a.lesson_id = lessons.id AND l.user_id = auth.uid()
    )
  );

CREATE POLICY "Guardians can insert lessons"
  ON public.lessons FOR INSERT
  WITH CHECK (guardian_id = auth.uid() AND public.has_role(auth.uid(), 'guardian'));

CREATE POLICY "Guardians can update own lessons"
  ON public.lessons FOR UPDATE
  USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can delete own lessons"
  ON public.lessons FOR DELETE
  USING (guardian_id = auth.uid());

-- ASSIGNMENTS POLICIES
CREATE POLICY "Guardians can view assignments for their learners"
  ON public.assignments FOR SELECT
  USING (guardian_id = auth.uid());

CREATE POLICY "Learners can view own assignments"
  ON public.assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.learners
      WHERE id = assignments.learner_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Guardians can insert assignments for their learners"
  ON public.assignments FOR INSERT
  WITH CHECK (
    guardian_id = auth.uid() 
    AND public.has_role(auth.uid(), 'guardian')
    AND public.is_guardian_of_learner(learner_id)
  );

CREATE POLICY "Guardians can update assignments"
  ON public.assignments FOR UPDATE
  USING (guardian_id = auth.uid());

CREATE POLICY "Guardians can delete assignments"
  ON public.assignments FOR DELETE
  USING (guardian_id = auth.uid());

-- CONVERSATIONS POLICIES
CREATE POLICY "Learners can view own conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.learners
      WHERE id = conversations.learner_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Guardians can view learner conversations"
  ON public.conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.learners
      WHERE id = conversations.learner_id AND guardian_id = auth.uid()
    )
  );

CREATE POLICY "Learners can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.learners
      WHERE id = learner_id AND user_id = auth.uid()
    )
  );

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages in accessible conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.learners l ON l.id = c.learner_id
      WHERE c.id = messages.conversation_id
      AND (l.user_id = auth.uid() OR l.guardian_id = auth.uid())
    )
  );

CREATE POLICY "Learners can insert messages in own conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.learners l ON l.id = c.learner_id
      WHERE c.id = conversation_id AND l.user_id = auth.uid()
    )
  );

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'guardian')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'guardian')
  );
  
  -- If guardian, create guardian record
  IF COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'guardian') = 'guardian' THEN
    INSERT INTO public.guardians (id, profile_id)
    VALUES (NEW.id, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();