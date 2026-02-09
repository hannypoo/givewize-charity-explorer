-- GiveWiZe User Profiles, Favorites, Receipts, Quiz, Employer Matching
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================================
-- 1. TABLES
-- ============================================================

-- User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  employer_name TEXT,
  employer_matches_donations BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Favorites
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  gift_registry BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, charity_id)
);

-- User Donation Receipts
CREATE TABLE IF NOT EXISTS public.user_donation_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
  charity_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tax_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  receipt_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Quiz Results
CREATE TABLE IF NOT EXISTS public.user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::JSONB,
  matched_charity_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employer Match Requests
CREATE TABLE IF NOT EXISTS public.user_employer_match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  charity_name TEXT NOT NULL,
  employer_name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','submitted','confirmed','denied')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_donation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_employer_match_requests ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_favorites policies
CREATE POLICY "Users can view own favorites" ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own favorites" ON public.user_favorites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);

-- user_donation_receipts policies
CREATE POLICY "Users can view own receipts" ON public.user_donation_receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own receipts" ON public.user_donation_receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own receipts" ON public.user_donation_receipts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own receipts" ON public.user_donation_receipts FOR DELETE USING (auth.uid() = user_id);

-- user_quiz_results policies
CREATE POLICY "Users can view own quiz results" ON public.user_quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON public.user_quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz results" ON public.user_quiz_results FOR DELETE USING (auth.uid() = user_id);

-- user_employer_match_requests policies
CREATE POLICY "Users can view own match requests" ON public.user_employer_match_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own match requests" ON public.user_employer_match_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own match requests" ON public.user_employer_match_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own match requests" ON public.user_employer_match_requests FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. AUTO-CREATE PROFILE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      SPLIT_PART(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_donation_receipts_updated_at
  BEFORE UPDATE ON public.user_donation_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_employer_match_requests_updated_at
  BEFORE UPDATE ON public.user_employer_match_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
