# Onboard Charity

Full charity onboarding pipeline: verify, gather data, score, and decide.

This is the orchestrator skill that chains verify-charity → gather-charity-data → score-charity in sequence, then makes an onboarding decision.

## Input
The user will provide a charity name and optionally an EIN, country, or website URL.
$ARGUMENTS

## Steps

### Step 1: Check for Duplicates
- Search the `charities` table for matching EIN (exact match) or similar name (case-insensitive)
- Use the Supabase MCP server if available, or query via the supabase client
- If a duplicate is found, report it to the user with a link and **stop** — do not proceed with onboarding

### Step 2: Verify the Charity
- If EIN is provided and country is USA: fetch from ProPublica API `https://projects.propublica.org/nonprofits/api/v2/organizations/{ein}.json`
- If name only: search ProPublica `https://projects.propublica.org/nonprofits/api/v2/search.json?q={name}`
- For non-US charities: use WebSearch to find the official registry
- Report verification status: **VERIFIED** (exact EIN match), **PROBABLE** (name match), or **UNVERIFIED**

### Step 3: Gather Data
- Pull all available data from ProPublica API (org details + latest filing)
- Map NTEE code to GiveWiZe category (A→arts-culture, B→education, C→environment-climate, D→animal-welfare, E/G/H→medical-health, F→mental-health, I/R→human-rights, K→hunger-food-security, L→housing-homelessness, O→child-welfare, Q→international-development, X→faith-based, default→community-development)
- Compute expense percentages from 990 filing data
- If website URL available, fetch it to extract mission statement and programs
- Identify all missing fields

### Step 4: Score the Charity
- Read `src/lib/charityUtils.ts` to use the canonical scoring algorithm
- Compute all sub-scores: Financial Efficiency (35%), Transparency (30%), Impact (25%), Longevity (10%)
- Compute overall GiveWiZe Score
- Present the full score report

### Step 5: Decision
Based on the gathered data and scores, recommend one of three actions:

**Auto-Approve** — if ALL of these are true:
- Verification is VERIFIED or PROBABLE
- Overall GiveWiZe Score >= 2.0
- Has name and primary_category
- **ALWAYS confirm with the user before writing to the database**
- If approved: insert into `charities` table, update `charity_requests` if applicable

**Flag for Review** — if ANY of these are true:
- Overall score < 2.0
- Verification is UNVERIFIED
- Present the data and recommend manual admin review

**Request More Info** — if:
- Critical fields are missing (mission_statement, website, primary_category, program_expense_percentage, year_founded)
- AND a charity contact email is available
- Suggest sending an info request email via the `send-info-request` Edge Function

### Step 6: Execute (if auto-approved and user confirms)
- Insert the charity record into the `charities` table
- Report the new charity ID and profile URL
- If a `charity_requests` row exists, update it with status=auto_approved, charity_id, computed_scores

## Important Rules
- **ALWAYS** confirm with the user before any database writes
- Show the complete charity profile data before insertion
- Report any data quality concerns or discrepancies
- If ProPublica API is unavailable, fall back to web search
