-- ============================================================================
-- Dormant Review System Migration
-- Adds status + user_id columns to community_reviews, updates the
-- aggregation trigger to only count approved reviews, and tightens RLS
-- so pending reviews are only visible to their authors.
-- ============================================================================

-- ── New columns ──────────────────────────────────────────────────────────────
ALTER TABLE public.community_reviews
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.community_reviews
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Index for efficient user-specific queries
CREATE INDEX IF NOT EXISTS idx_community_reviews_user
  ON public.community_reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_community_reviews_status
  ON public.community_reviews(status);

-- ── Update aggregation trigger to only count approved reviews ────────────────
CREATE OR REPLACE FUNCTION public.update_charity_community_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_charity_id uuid;
BEGIN
  -- Handle DELETE (OLD row) vs INSERT/UPDATE (NEW row)
  IF TG_OP = 'DELETE' THEN
    target_charity_id := OLD.charity_id;
  ELSE
    target_charity_id := NEW.charity_id;
  END IF;

  UPDATE public.charities
  SET
    community_rating_average = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.community_reviews
      WHERE charity_id = target_charity_id
        AND status = 'approved'
    ),
    community_rating_count = (
      SELECT COUNT(*)
      FROM public.community_reviews
      WHERE charity_id = target_charity_id
        AND status = 'approved'
    )
  WHERE id = target_charity_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ── Update RLS policies ─────────────────────────────────────────────────────

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can view community reviews" ON public.community_reviews;
DROP POLICY IF EXISTS "Anyone can submit community reviews" ON public.community_reviews;

-- SELECT: approved reviews visible to all; pending reviews visible only to author
CREATE POLICY "View approved or own reviews"
  ON public.community_reviews FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

-- INSERT: must be logged in
CREATE POLICY "Logged-in users can submit reviews"
  ON public.community_reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
