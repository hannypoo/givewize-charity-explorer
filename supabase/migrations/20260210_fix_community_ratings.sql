-- Community Rating v2: Data-driven scoring based on real evaluator data
--
-- FORMULA: Weighted average of 5 dimensions, each scored 0-5:
--
--   community_rating = CN*0.30 + GS*0.15 + BBB*0.20 + REP*0.20 + SENT*0.15
--
-- Dimensions:
--   CN   (30%) - Charity Navigator score (score% ÷ 20; stars-only: 4★=4.5, 3★=3.5, 2★=2.5)
--   GS   (15%) - GuideStar/Candid seal (Platinum=5, Gold=4, Silver=3, Bronze=2)
--   BBB  (20%) - BBB Wise Giving (20/20=5.0, 19/20=4.75, 18/20=4.5, Did Not Disclose=3.5, Not Met=3.0)
--   REP  (20%) - Public reputation (None=5, Minor=4.5, Moderate=3.5, Significant=2.5, Major=1.5)
--   SENT (15%) - Community sentiment (GreatNonprofits + public reviews, 0-5 scale)
--
-- Missing evaluator data uses neutral defaults (3.5) rather than penalizing.
-- International/non-US charities without US evaluator presence get base 3.5-4.0.
--
-- Sources: Charity Navigator, GuideStar/Candid, BBB Wise Giving Alliance,
--          GreatNonprofits, CharityWatch, ProPublica, Forbes, media investigations.
-- Research date: February 2026.

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 1: Elite (4.8+) — Perfect or near-perfect across all evaluators
-- ═══════════════════════════════════════════════════════════════════════

-- CN=100%, GS=Platinum, BBB=20/20, No controversy, GNP=5/5
UPDATE charities SET community_rating_average = 5.00 WHERE name = 'Direct Relief';

-- CN=100%, GS=Platinum, BBB=Accredited, No controversy, GNP=Top-Rated
UPDATE charities SET community_rating_average = 4.98 WHERE name = 'CURE Epilepsy';

-- CN=99%, GS=Platinum, BBB=20/20, No controversy, GNP=Top-Rated
UPDATE charities SET community_rating_average = 4.96 WHERE name = 'St. Jude Children''s Research Hospital';

-- CN=99%, GS=Platinum, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.82 WHERE name = 'Ocean Conservancy';

-- CN=99%, GS=Platinum, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.80 WHERE name = 'Leukemia & Lymphoma Society';

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 2: Excellent (4.5–4.79) — Strong across evaluators, minor gaps
-- ═══════════════════════════════════════════════════════════════════════

-- CN=97%, GS=Platinum, BBB=18/20, Minor BBB gaps, GNP=Top-Rated
UPDATE charities SET community_rating_average = 4.76 WHERE name = 'National Organization for Rare Disorders (NORD)';

-- CN=95%, GS=Platinum, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.75 WHERE name = 'RAINN (Rape, Abuse & Incest National Network)';

-- CN=99%, GS=Platinum, BBB=listed, No controversy
UPDATE charities SET community_rating_average = 4.74 WHERE name = 'Alex''s Lemonade Stand Foundation';

-- CN=4★, GS=Platinum, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.68 WHERE name = 'National Alliance on Mental Illness (NAMI)';

-- CN=99%, GS=not confirmed, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.66 WHERE name = 'American Heart Association';

-- CN=4★, GS=Platinum, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.64 WHERE name = 'National Osteoporosis Foundation';

-- CN=100%, GS=not confirmed, BBB=20/20, No controversy, Forbes #21
UPDATE charities SET community_rating_average = 4.63 WHERE name = 'The Arc of the United States';

-- CN=94%, GS=Platinum, BBB=20/20, Minor political criticism
UPDATE charities SET community_rating_average = 4.62 WHERE name = 'Human Rights Watch';

-- CN=98%, GS=not confirmed, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.61 WHERE name = 'Sierra Club Foundation';

-- CN=100%, GS=profile, BBB=18/20, No controversy
UPDATE charities SET community_rating_average = 4.60 WHERE name = 'Prevent Child Abuse America';

-- CN=92%, GS=Gold, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.55 WHERE name = 'Farm Sanctuary';

-- CN=4★, GS=not confirmed, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.54 WHERE name = 'Prostate Cancer Foundation';

-- CN=4★, GS=not confirmed, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.53 WHERE name = 'The Ehlers-Danlos Society';

-- CN=4★, GS=not confirmed, BBB=Meets standards, No controversy
UPDATE charities SET community_rating_average = 4.52 WHERE name = 'DonorsChoose';

-- CN=99%, GS=Silver, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.51 WHERE name = 'American Diabetes Association';

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 3: Very Good (4.2–4.49) — Well-rated with some mixed signals
-- ═══════════════════════════════════════════════════════════════════════

-- CN=~93%, GS=Gold, BBB=20/20, Minor (exec comp, fundraising)
UPDATE charities SET community_rating_average = 4.49 WHERE name = 'Feeding America';

-- CN=98%, GS=Platinum, BBB=20/20, Moderate (corporate ties, fracking)
UPDATE charities SET community_rating_average = 4.48 WHERE name = 'Environmental Defense Fund';

-- CN=~97%, GS=Platinum, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 4.47 WHERE name = 'Everylife Foundation';

-- CN=96%, GS=not confirmed, BBB=20/20, Minor political criticism
UPDATE charities SET community_rating_average = 4.46 WHERE name = 'Amnesty International USA';

-- CN=98%, GS=not confirmed, BBB=20/20, Minor political criticism
UPDATE charities SET community_rating_average = 4.45 WHERE name = 'ACLU';

-- CN=98%, GS=Platinum, BBB=not evaluated, No controversy
UPDATE charities SET community_rating_average = 4.44 WHERE name = 'Breast Cancer Research Foundation';

-- CN=~97%, GS=Platinum, BBB=Did Not Disclose, No controversy major
UPDATE charities SET community_rating_average = 4.43 WHERE name = 'Doctors Without Borders (MSF)';

-- CN=100% A&T, GS=Platinum, BBB=not confirmed, Moderate (CEO removal, union), GNP=4.9/5
UPDATE charities SET community_rating_average = 4.39 WHERE name = 'The Trevor Project';

-- CN=98%, GS=not confirmed, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 4.37 WHERE name = 'All Hands and Hearts';

-- CN=99%, GS=not confirmed, BBB=Review in Progress, No controversy
UPDATE charities SET community_rating_average = 4.36 WHERE name = 'Scholarship America';

-- CN=4★, GS=not found, BBB=20/20, Minor (eligibility concerns)
UPDATE charities SET community_rating_average = 4.35 WHERE name = 'Make-A-Wish Foundation of America';

-- CN=77%, GS=Platinum, BBB=19/20, Minor (advocacy framing)
UPDATE charities SET community_rating_average = 4.33 WHERE name = 'Autism Society of America';

-- CN=86%, GS=Silver, BBB=20/20, No controversy
UPDATE charities SET community_rating_average = 4.31 WHERE name = 'Meals on Wheels America';

-- CN=~95%, GS=Gold, BBB=20/20, Moderate (CEO salary $1.25M)
UPDATE charities SET community_rating_average = 4.30 WHERE name = 'International Rescue Committee';

-- CN=97%, GS=Gold, BBB=Did not respond, No controversy
UPDATE charities SET community_rating_average = 4.28 WHERE name = 'National Domestic Violence Hotline';

-- CN=4★, GS=Platinum, BBB=Standards Not Met, No controversy
UPDATE charities SET community_rating_average = 4.27 WHERE name = 'No Kid Hungry';

-- CN=96%, GS=profile, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 4.26 WHERE name = 'Single Parent Scholarship Fund';

-- CN=4★, GS=Platinum, BBB=Review in Progress, Minor (leadership complaints)
UPDATE charities SET community_rating_average = 4.25 WHERE name = 'Team Rubicon';

-- CN=100%, GS=not found, BBB=Not evaluated, Minor (exec comp)
UPDATE charities SET community_rating_average = 4.23 WHERE name = 'Khan Academy';

-- CN=97%, GS=not confirmed, BBB=Did not respond, Minor (greenwashing)
UPDATE charities SET community_rating_average = 4.22 WHERE name = 'Rainforest Alliance';

-- CN=4★, GS=not confirmed, BBB=not evaluated, No controversy
UPDATE charities SET community_rating_average = 4.21 WHERE name = 'Room to Read';

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 4: Good (3.9–4.19) — Solid but with notable gaps or concerns
-- ═══════════════════════════════════════════════════════════════════════

-- CN=97%, GS=not confirmed, BBB=not found, Minor (book bans)
UPDATE charities SET community_rating_average = 4.18 WHERE name = 'Girls Who Code';

-- CN=4★, GS=profile, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 4.17 WHERE name = 'Learning Disabilities Association of America';

-- CN=4★, GS=Platinum, BBB=20/20, Significant (overhead 16% direct, exec comp $2.2M)
UPDATE charities SET community_rating_average = 4.15 WHERE name = 'American Cancer Society';

-- CN=4★, GS=Platinum, BBB=Standards Not Met, Moderate (no-kill criticism, origins)
UPDATE charities SET community_rating_average = 4.12 WHERE name = 'Best Friends Animal Society';

-- CN=94%, GS=not confirmed, BBB=13/20, Minor (BBB governance)
UPDATE charities SET community_rating_average = 4.09 WHERE name = 'Osteogenesis Imperfecta Foundation';

-- CN=99%, GS=Platinum, BBB=20/20, Major (paramilitary human rights abuses—BuzzFeed/UN investigation)
UPDATE charities SET community_rating_average = 4.06 WHERE name = 'World Wildlife Fund';

-- CN=4★, GS=Platinum, BBB=Does NOT meet, Minor (BBB governance)
UPDATE charities SET community_rating_average = 4.03 WHERE name = 'Epilepsy Foundation';

-- CN=~97%, GS=Platinum, BBB=20/20 (restored), Major (2018 harassment, CharityWatch D)
UPDATE charities SET community_rating_average = 4.01 WHERE name = 'The Humane Society of the United States';

-- CN=4★, GS=not found, BBB=Standards Not Met, No controversy
UPDATE charities SET community_rating_average = 3.98 WHERE name = 'Partners In Health';

-- CN=94%, GS=Platinum, BBB=20/20, Major (Planned Parenthood, trademark, low research %)
UPDATE charities SET community_rating_average = 3.96 WHERE name = 'Susan G. Komen';

-- CN=3★ 75%, GS=profile, BBB=not found, No controversy, GNP=Top-Rated 2013
UPDATE charities SET community_rating_average = 3.95 WHERE name = 'Global Genes';

-- CN=96%, GS=Gold, BBB=20/20, Major (fossil fuel ties, self-dealing, #MeToo, carbon offsets)
UPDATE charities SET community_rating_average = 3.91 WHERE name = 'The Nature Conservancy';

-- CN=~95%, GS=not confirmed, BBB=Declined eval, Moderate (training, turnover, deprofessionalization)
UPDATE charities SET community_rating_average = 3.90 WHERE name = 'Teach For America';

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 5: Above Average (3.5–3.89) — Limited data or notable controversy
-- ═══════════════════════════════════════════════════════════════════════

-- CN=4★, GS=Platinum, BBB=20/20, Major (Haiti, Sandy, Katrina—ProPublica investigations), GNP=2.6/5
UPDATE charities SET community_rating_average = 3.82 WHERE name = 'American Red Cross';

-- No US evaluator data (UK charity, all-volunteer), No controversy
UPDATE charities SET community_rating_average = 3.80 WHERE name = 'Nicolaides-Baraitser Syndrome Support & Research';

-- CN=Not rated (insufficient data), GS=profile, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 3.79 WHERE name = 'Genetic Alliance';

-- CN=3★, GS=profile, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 3.78 WHERE name = 'University of Washington Foundation';

-- CN=4★ 99%, GS=not confirmed, BBB=99/100 A&T, Major (ASPCA spending: CharityWatch C-, CEO $840k, donor confusion)
UPDATE charities SET community_rating_average = 3.76 WHERE name = 'ASPCA';

-- CN=Not found (small org), GS=profile, BBB=not found, No controversy
UPDATE charities SET community_rating_average = 3.75 WHERE name = '1in6';

-- CN=3★, GS=Platinum, BBB=Did Not Disclose, Moderate (workplace culture, BBB non-disclosure)
UPDATE charities SET community_rating_average = 3.73 WHERE name = 'Pencils of Promise';

-- CN=100%, GS=not confirmed, BBB=not found, Significant (Loris.ai data-sharing scandal, Sitejabber 1.2/5)
UPDATE charities SET community_rating_average = 3.72 WHERE name = 'Crisis Text Line';

-- CN=100%, GS=not found, BBB=Standards Not Met, Significant (Gaza worker deaths 2024)
UPDATE charities SET community_rating_average = 3.68 WHERE name = 'World Central Kitchen';

-- CN=96%, GS=not confirmed, BBB=Not evaluated, Major (conflict-of-interest—ProPublica, Paige.AI)
UPDATE charities SET community_rating_average = 3.61 WHERE name = 'Memorial Sloan Kettering Cancer Center';

-- CN=99%, GS=Gold, BBB=Did Not Disclose, Major (CharityWatch F, founder fired, $787M endowment, labeling)
UPDATE charities SET community_rating_average = 3.58 WHERE name = 'Southern Poverty Law Center';

-- CN=4★, GS=not confirmed, BBB=Not evaluated, Major ($15M DOJ fraud settlement, research misconduct)
UPDATE charities SET community_rating_average = 3.52 WHERE name = 'Dana-Farber Cancer Institute';

-- No US evaluator data (Canadian charity), No controversy
UPDATE charities SET community_rating_average = 3.50 WHERE name = 'Rare Disease Foundation';

-- N/A (merged into BHOF in 2017), legacy entity
UPDATE charities SET community_rating_average = 3.48 WHERE name = 'Paget Foundation';

-- No US evaluator data (International/European coalition), No controversy
UPDATE charities SET community_rating_average = 3.42 WHERE name = 'Rare Diseases International (RDI)';

-- ═══════════════════════════════════════════════════════════════════════
-- TIER 6: Average (3.0–3.49) — Limited evaluator presence
-- ═══════════════════════════════════════════════════════════════════════

-- CN=2★ (hospital entity), GS=not confirmed, Moderate (racial discrimination lawsuit $21M)
UPDATE charities SET community_rating_average = 3.28 WHERE name = 'Seattle Children''s Hospital';
