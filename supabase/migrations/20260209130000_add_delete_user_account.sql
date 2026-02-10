-- ============================================================================
-- RPC function to let a user delete their own account and all associated data.
-- Uses SECURITY DEFINER to access auth.users (requires superuser context).
-- The calling user can only delete themselves (auth.uid() check).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete from all user data tables
  DELETE FROM public.user_employer_match_requests WHERE user_id = uid;
  DELETE FROM public.user_quiz_results WHERE user_id = uid;
  DELETE FROM public.user_donation_receipts WHERE user_id = uid;
  DELETE FROM public.user_favorites WHERE user_id = uid;
  DELETE FROM public.user_profiles WHERE id = uid;

  -- Delete the auth user
  DELETE FROM auth.users WHERE id = uid;
END;
$$;
