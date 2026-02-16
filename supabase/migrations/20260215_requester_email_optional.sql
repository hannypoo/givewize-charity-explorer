-- Make requester_email optional (nullable) on charity_requests
-- The system provides real-time feedback via the UI; email notifications are optional
ALTER TABLE charity_requests ALTER COLUMN requester_email DROP NOT NULL;
