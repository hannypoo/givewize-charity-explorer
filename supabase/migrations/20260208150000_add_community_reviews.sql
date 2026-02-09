-- ============================================================================
-- Community Rating Agent: Database Tables
-- Adds online_review_sources and community_reviews tables for the
-- Community Rating Agent feature.
-- ============================================================================

-- ── Online Review Sources ──────────────────────────────────────────────────
-- Stores ratings from external evaluators (Charity Navigator, BBB, etc.)
-- for each charity. One row per source per charity.
CREATE TABLE public.online_review_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,

  source_name TEXT NOT NULL,          -- e.g. 'charity_navigator', 'bbb_wise_giving', 'guidestar', 'greatnonprofits'
  display_name TEXT NOT NULL,         -- e.g. 'Charity Navigator'
  rating NUMERIC(4,1),               -- Raw rating in the source's own scale
  max_rating NUMERIC(4,1) NOT NULL,  -- Max possible rating for this source
  rating_scale TEXT NOT NULL DEFAULT 'numeric', -- 'numeric', 'pass_fail', 'seal'
  review_count INTEGER DEFAULT 0,
  source_url TEXT,                    -- Link to the charity's page on this source
  note TEXT,                          -- e.g. 'Platinum Seal of Transparency'
  last_updated DATE DEFAULT CURRENT_DATE,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE(charity_id, source_name)
);

-- ── Community Reviews (Verified Donor Reviews) ────────────────────────────
-- Stores individual reviews from verified donors on GiveWiZe.
CREATE TABLE public.community_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,

  donor_name TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),

  -- Category breakdown ratings (1-5)
  rating_impact NUMERIC(2,1) CHECK (rating_impact >= 1 AND rating_impact <= 5),
  rating_communication NUMERIC(2,1) CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_transparency NUMERIC(2,1) CHECK (rating_transparency >= 1 AND rating_transparency <= 5),
  rating_experience NUMERIC(2,1) CHECK (rating_experience >= 1 AND rating_experience <= 5),

  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 50),
  donation_amount NUMERIC(12,2),       -- Optional, self-reported
  helpful_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ── Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.online_review_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access (reviews and sources are public information)
CREATE POLICY "Anyone can view online review sources"
  ON public.online_review_sources FOR SELECT USING (true);

CREATE POLICY "Anyone can view community reviews"
  ON public.community_reviews FOR SELECT USING (true);

-- Allow inserts for community reviews (anyone can leave a review for MVP)
CREATE POLICY "Anyone can submit community reviews"
  ON public.community_reviews FOR INSERT WITH CHECK (true);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_online_review_sources_charity ON public.online_review_sources(charity_id);
CREATE INDEX idx_community_reviews_charity ON public.community_reviews(charity_id);
CREATE INDEX idx_community_reviews_rating ON public.community_reviews(rating);
CREATE INDEX idx_community_reviews_created ON public.community_reviews(created_at DESC);

-- ── Triggers ───────────────────────────────────────────────────────────────
CREATE TRIGGER update_online_review_sources_updated_at
  BEFORE UPDATE ON public.online_review_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_reviews_updated_at
  BEFORE UPDATE ON public.community_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ── Auto-update community_rating on charities table ────────────────────────
-- When a new review is inserted, update the charity's average and count.
CREATE OR REPLACE FUNCTION public.update_charity_community_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.charities
  SET
    community_rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.community_reviews
      WHERE charity_id = NEW.charity_id
    ),
    community_rating_count = (
      SELECT COUNT(*)
      FROM public.community_reviews
      WHERE charity_id = NEW.charity_id
    )
  WHERE id = NEW.charity_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_charity_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.community_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_charity_community_rating();
