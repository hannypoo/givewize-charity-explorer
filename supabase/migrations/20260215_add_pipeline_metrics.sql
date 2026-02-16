-- Add pipeline_metrics JSONB column to charity_requests
-- Stores AI agent benchmarking data for the onboarding pipeline
ALTER TABLE charity_requests ADD COLUMN IF NOT EXISTS pipeline_metrics JSONB DEFAULT NULL;
