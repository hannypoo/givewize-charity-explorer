-- ============================================================================
-- Adds an RPC function to atomically increment helpful_count on community
-- reviews. Uses SECURITY DEFINER to bypass RLS (no UPDATE policy needed).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_review_helpful(review_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id;
END;
$$;
