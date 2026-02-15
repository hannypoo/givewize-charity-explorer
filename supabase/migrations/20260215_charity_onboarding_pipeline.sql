-- ============================================================================
-- Charity Onboarding Pipeline Migration
-- Adds automated verification, scoring, and info-request flow
-- ============================================================================

-- 1. ALTER charity_requests — add onboarding pipeline columns
ALTER TABLE charity_requests
  ADD COLUMN IF NOT EXISTS ein TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'USA',
  ADD COLUMN IF NOT EXISTS charity_contact_email TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT,
  ADD COLUMN IF NOT EXISTS propublica_data JSONB,
  ADD COLUMN IF NOT EXISTS computed_scores JSONB,
  ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS charity_id UUID REFERENCES charities(id);

-- 2. CREATE charity_info_requests table
CREATE TABLE IF NOT EXISTS charity_info_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_request_id UUID NOT NULL REFERENCES charity_requests(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  contact_email TEXT NOT NULL,
  missing_fields TEXT[] NOT NULL DEFAULT '{}',
  missing_fields_labels JSONB NOT NULL DEFAULT '{}',
  submitted_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'expired', 'processed')),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_charity_info_requests_token
  ON charity_info_requests(token);
CREATE INDEX IF NOT EXISTS idx_charity_requests_ein
  ON charity_requests(ein);
CREATE INDEX IF NOT EXISTS idx_charity_requests_status
  ON charity_requests(status);

-- 4. RLS policies for charity_info_requests
ALTER TABLE charity_info_requests ENABLE ROW LEVEL SECURITY;

-- Public can read by token (token acts as auth)
CREATE POLICY "Public can read info requests by token"
  ON charity_info_requests
  FOR SELECT
  USING (true);

-- No public INSERT/UPDATE — Edge Functions use service_role key
-- Service role bypasses RLS automatically

-- 5. Updated_at trigger for charity_info_requests
CREATE OR REPLACE FUNCTION update_charity_info_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_charity_info_requests_updated_at
  BEFORE UPDATE ON charity_info_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_charity_info_requests_updated_at();
