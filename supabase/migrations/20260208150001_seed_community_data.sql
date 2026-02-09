-- ============================================================================
-- Seed data for Community Rating Agent tables
-- Populates online_review_sources and community_reviews for all charities.
-- Uses subqueries to reference charities by name (since UUIDs are auto-generated).
-- ============================================================================

-- ── Helper: Insert online review sources for a charity by name ─────────────
-- Each charity gets 4 external source entries (Charity Navigator, BBB, GuideStar, GreatNonprofits)

-- CHARITY 001: Nicolaides-Baraitser Syndrome Support & Research
INSERT INTO public.online_review_sources (charity_id, source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
SELECT c.id, s.source_name, s.display_name, s.rating, s.max_rating, s.rating_scale, s.review_count, s.source_url, s.note
FROM public.charities c
CROSS JOIN (VALUES
  ('charity_navigator', 'Charity Navigator', NULL::numeric, 4.0, 'numeric', 0, NULL::text, 'Not yet rated — ultra-rare disease nonprofit'),
  ('bbb_wise_giving', 'BBB Wise Giving Alliance', NULL, 20.0, 'pass_fail', 0, NULL, 'UK-based charity — not covered'),
  ('guidestar', 'GuideStar (Candid)', NULL, 4.0, 'seal', 0, NULL, 'Not listed — international charity'),
  ('greatnonprofits', 'GreatNonprofits', NULL, 5.0, 'numeric', 0, NULL, 'No reviews available')
) AS s(source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
WHERE c.name = 'Nicolaides-Baraitser Syndrome Support & Research';

-- CHARITY 002: NORD
INSERT INTO public.online_review_sources (charity_id, source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
SELECT c.id, s.source_name, s.display_name, s.rating, s.max_rating, s.rating_scale, s.review_count, s.source_url, s.note
FROM public.charities c
CROSS JOIN (VALUES
  ('charity_navigator', 'Charity Navigator', 4.0, 4.0, 'numeric', 47, 'https://www.charitynavigator.org/ein/061049006', '4/4 stars — 100/100 financial efficiency'),
  ('bbb_wise_giving', 'BBB Wise Giving Alliance', 17.0, 20.0, 'pass_fail', 0, 'https://www.give.org/charity-reviews/national/health/national-organization-for-rare-disorders-in-quincy-ct-1451', 'Meets 17 of 20 standards'),
  ('guidestar', 'GuideStar (Candid)', 4.0, 4.0, 'seal', 0, 'https://www.guidestar.org/profile/06-1049006', 'Platinum Seal of Transparency'),
  ('greatnonprofits', 'GreatNonprofits', 4.8, 5.0, 'numeric', 156, 'https://greatnonprofits.org/org/national-organization-for-rare-disorders-inc', 'Top-rated nonprofit')
) AS s(source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
WHERE c.name = 'National Organization for Rare Disorders (NORD)';

-- CHARITY 003: Global Genes
INSERT INTO public.online_review_sources (charity_id, source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
SELECT c.id, s.source_name, s.display_name, s.rating, s.max_rating, s.rating_scale, s.review_count, s.source_url, s.note
FROM public.charities c
CROSS JOIN (VALUES
  ('charity_navigator', 'Charity Navigator', 3.0, 4.0, 'numeric', 12, 'https://www.charitynavigator.org/ein/331140807', '3/4 stars'),
  ('bbb_wise_giving', 'BBB Wise Giving Alliance', NULL::numeric, 20.0, 'pass_fail', 0, NULL::text, 'Not currently reviewed'),
  ('guidestar', 'GuideStar (Candid)', 3.0, 4.0, 'seal', 0, 'https://www.guidestar.org/profile/33-1140807', 'Gold Seal of Transparency'),
  ('greatnonprofits', 'GreatNonprofits', 4.5, 5.0, 'numeric', 89, 'https://greatnonprofits.org/org/global-genes-project', 'Top-rated 2024')
) AS s(source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
WHERE c.name = 'Global Genes';

-- ── BULK INSERT: Remaining charities (004-071) ────────────────────────────
-- For charities without specific external data, we generate reasonable
-- defaults based on their category and known reputation.

-- Function to bulk-seed sources for remaining charities
DO $$
DECLARE
  charity_rec RECORD;
  cn_rating NUMERIC;
  bbb_rating NUMERIC;
  gs_rating NUMERIC;
  gnp_rating NUMERIC;
  cn_count INTEGER;
  gnp_count INTEGER;
  cn_url TEXT;
  gs_url TEXT;
  gnp_url TEXT;
  clean_ein TEXT;
BEGIN
  FOR charity_rec IN
    SELECT id, name, ein, score_overall, score_financial_efficiency, score_transparency,
           complete_990_filed, financials_published
    FROM public.charities
    WHERE name NOT IN (
      'Nicolaides-Baraitser Syndrome Support & Research',
      'National Organization for Rare Disorders (NORD)',
      'Global Genes'
    )
  LOOP
    -- Clean EIN for URL building
    clean_ein := REPLACE(COALESCE(charity_rec.ein, ''), '-', '');

    -- Derive ratings from existing scores, or use category-appropriate defaults
    -- Well-known charities get higher baseline ratings
    IF charity_rec.score_overall IS NOT NULL THEN
      cn_rating := LEAST(4, ROUND((charity_rec.score_financial_efficiency / 5.0) * 4));
      bbb_rating := LEAST(20, ROUND((charity_rec.score_transparency / 5.0) * 20));
      gs_rating := LEAST(4, GREATEST(1, ROUND(charity_rec.score_transparency * 0.8)));
      gnp_rating := LEAST(5.0, ROUND(charity_rec.score_overall * 0.95, 1));
    ELSE
      -- Default: well-known nonprofits get solid baseline ratings
      cn_rating := 3;
      bbb_rating := 16;
      gs_rating := 3;
      gnp_rating := 4.2;
    END IF;

    -- Review counts
    cn_count := FLOOR(RANDOM() * 60 + 10);
    gnp_count := FLOOR(RANDOM() * 150 + 20);

    -- Build URLs
    IF clean_ein != '' AND clean_ein NOT LIKE '%verify%' AND clean_ein NOT LIKE '%International%' THEN
      cn_url := 'https://www.charitynavigator.org/ein/' || clean_ein;
      gs_url := 'https://www.guidestar.org/profile/' || charity_rec.ein;
    ELSE
      cn_url := NULL;
      gs_url := NULL;
    END IF;
    gnp_url := 'https://greatnonprofits.org';

    -- Insert 4 sources per charity
    INSERT INTO public.online_review_sources (charity_id, source_name, display_name, rating, max_rating, rating_scale, review_count, source_url, note)
    VALUES
      (charity_rec.id, 'charity_navigator', 'Charity Navigator', cn_rating, 4, 'numeric', cn_count, cn_url,
        CASE WHEN cn_rating = 4 THEN '4/4 stars — excellent' WHEN cn_rating = 3 THEN '3/4 stars — good' WHEN cn_rating = 2 THEN '2/4 stars — needs improvement' ELSE '1/4 stars' END),
      (charity_rec.id, 'bbb_wise_giving', 'BBB Wise Giving Alliance', bbb_rating, 20, 'pass_fail', 0, 'https://www.give.org',
        'Meets ' || bbb_rating::text || ' of 20 standards'),
      (charity_rec.id, 'guidestar', 'GuideStar (Candid)', gs_rating, 4, 'seal', 0, gs_url,
        CASE WHEN gs_rating = 4 THEN 'Platinum Seal' WHEN gs_rating = 3 THEN 'Gold Seal' WHEN gs_rating = 2 THEN 'Silver Seal' ELSE 'Bronze Seal' END),
      (charity_rec.id, 'greatnonprofits', 'GreatNonprofits', gnp_rating, 5, 'numeric', gnp_count, gnp_url,
        'Community reviewed');
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED COMMUNITY REVIEWS (Verified Donor Reviews)
-- 2-3 reviews per charity with realistic text tailored to each category
-- ═══════════════════════════════════════════════════════════════════════════

-- Template reviews by category — inserted via DO block
DO $$
DECLARE
  charity_rec RECORD;
  cat TEXT;
  r1_text TEXT;
  r2_text TEXT;
  r3_text TEXT;
  r1_impact NUMERIC; r1_comm NUMERIC; r1_trans NUMERIC; r1_exp NUMERIC;
  r2_impact NUMERIC; r2_comm NUMERIC; r2_trans NUMERIC; r2_exp NUMERIC;
  r3_impact NUMERIC; r3_comm NUMERIC; r3_trans NUMERIC; r3_exp NUMERIC;
  names TEXT[] := ARRAY['Sarah M.', 'Michael T.', 'Dr. Patricia W.', 'James R.', 'Linda K.', 'Rebecca S.', 'Carlos D.', 'Emily C.', 'David L.', 'Jennifer H.', 'Robert A.', 'Maria G.', 'Thomas B.', 'Amanda F.', 'Christopher P.', 'Jessica N.', 'Daniel W.', 'Katherine E.', 'Andrew J.', 'Nicole V.'];
  name_idx INTEGER;
BEGIN
  FOR charity_rec IN
    SELECT id, name, primary_category FROM public.charities
  LOOP
    cat := charity_rec.primary_category;
    name_idx := (FLOOR(RANDOM() * 18) + 1)::integer;

    -- Generate category-appropriate review text
    CASE cat
      WHEN 'rare-diseases' THEN
        r1_text := 'As a family affected by a rare condition, this organization has been our lifeline. They connected us with specialists, provided educational resources, and made us feel less alone in our journey. Their advocacy work is making a real difference for the rare disease community.';
        r2_text := 'I have been donating to this organization for several years because of their dedication to rare disease research and patient support. Their programs are well-run and they maintain excellent communication with donors about how funds are being used.';
        r3_text := 'The work this charity does for the rare disease community is extraordinary. From research funding to family support services, they cover every aspect of what patients and families need. Their annual reports are thorough and demonstrate real accountability.';
      WHEN 'medical-health' THEN
        r1_text := 'This healthcare charity has made a tremendous impact on our community. Their programs reach people who otherwise would not have access to quality medical care. The transparency of their operations gives me confidence that my donations are well-spent.';
        r2_text := 'I have supported this organization because of their evidence-based approach to healthcare. They publish measurable outcomes and are transparent about both their successes and areas for growth. A truly well-managed medical charity.';
        r3_text := 'As a healthcare professional, I can vouch for the quality of this organization''s programs. Their research grants and patient services are making a measurable difference. I appreciate their commitment to financial transparency and accountability.';
      WHEN 'education' THEN
        r1_text := 'This education charity is transforming lives through learning. I have seen firsthand how their programs help students reach their potential. Their approach is innovative and they measure outcomes carefully to ensure maximum impact.';
        r2_text := 'I donate because education is the foundation of opportunity. This organization uses funds wisely, with most going directly to programs and students. Their annual reports clearly show the impact of every dollar donated.';
        r3_text := 'As an educator, I have witnessed the positive impact of this charity''s programs on students and communities. Their commitment to equity in education and transparent operations makes them a standout in the nonprofit space.';
      WHEN 'animal-welfare' THEN
        r1_text := 'This animal welfare organization does incredible work rescuing and protecting animals. Their shelters are well-maintained and their adoption programs are thoughtfully designed. I trust them with my donations because they are transparent about their finances.';
        r2_text := 'I have been a monthly donor for years and I am always impressed by the impact reports they share. The number of animals they save annually is remarkable, and their advocacy for stronger animal protection laws is equally important.';
        r3_text := 'As a veterinarian, I appreciate this organization''s evidence-based approach to animal welfare. Their programs are well-designed, their staff is dedicated, and they maintain high standards of transparency and accountability.';
      WHEN 'human-rights' THEN
        r1_text := 'This human rights organization is doing critical work to protect vulnerable communities. Their legal advocacy and on-the-ground support have made a real difference in countless lives. I trust their financial stewardship and transparency.';
        r2_text := 'I donate because human rights matter, and this organization takes a smart, strategic approach to defending them. They are transparent about their methods and finances, and their impact reports are thorough and honest.';
        r3_text := 'The courage and dedication of this organization is inspiring. They take on difficult cases and systemic issues that others shy away from. Their communication with donors is excellent and their financial accountability is top-notch.';
      WHEN 'hunger-food-security' THEN
        r1_text := 'This hunger relief organization is incredibly efficient at getting food to families in need. Their logistics and distribution network is impressive, and they partner with local communities to ensure culturally appropriate food access.';
        r2_text := 'I have volunteered and donated, and I can say that this organization runs like a well-oiled machine. The percentage of funds going directly to feeding people is among the highest in the sector. Highly recommended.';
        r3_text := 'Fighting hunger requires both immediate relief and systemic change, and this organization excels at both. Their programs are data-driven, their outcomes are measurable, and their transparency gives donors like me great confidence.';
      WHEN 'environment-climate' THEN
        r1_text := 'This environmental organization combines grassroots action with science-based advocacy to protect our planet. Their conservation programs have preserved critical ecosystems, and they are transparent about how donations fund their work.';
        r2_text := 'I donate because climate action cannot wait, and this organization takes a pragmatic, results-oriented approach. Their partnerships with communities and governments produce real, measurable environmental outcomes.';
        r3_text := 'As an environmental scientist, I am impressed by this organization''s evidence-based conservation strategies. They publish detailed impact metrics and maintain excellent financial transparency. A leader in environmental philanthropy.';
      WHEN 'emergency-relief' THEN
        r1_text := 'When disaster strikes, this organization is among the first to respond. Their rapid deployment capabilities and efficient operations mean help reaches people when they need it most. I have complete trust in how they use donations.';
        r2_text := 'I have donated after several natural disasters and every time I am impressed by the speed and effectiveness of their response. Their post-disaster reports clearly show how funds were allocated and the impact achieved.';
        r3_text := 'This emergency relief organization sets the standard for disaster response. Their preparedness, speed, and community-centered approach is remarkable. Financial transparency is excellent and accountability to donors is a clear priority.';
      ELSE
        r1_text := 'This organization is making a meaningful difference in the community it serves. Their programs are well-designed, outcomes are measurable, and they maintain strong transparency standards. I feel confident that my donations are being put to good use.';
        r2_text := 'I have been supporting this charity because of their clear mission and proven impact. Their communication with donors is good, and their financial reports demonstrate responsible stewardship of contributed funds.';
        r3_text := 'As a longtime donor, I appreciate this organization''s commitment to their mission and their transparency in operations. They consistently deliver results and communicate openly about both successes and challenges.';
    END CASE;

    -- Rating patterns (vary slightly per review)
    r1_impact := 5; r1_comm := 5; r1_trans := 4; r1_exp := 5;
    r2_impact := 5; r2_comm := 4; r2_trans := 4; r2_exp := 4;
    r3_impact := 5; r3_comm := 4; r3_trans := 5; r3_exp := 5;

    -- Insert 3 reviews per charity
    INSERT INTO public.community_reviews (charity_id, donor_name, verified, rating, rating_impact, rating_communication, rating_transparency, rating_experience, review_text, donation_amount, helpful_count, created_at)
    VALUES
      (charity_rec.id, names[name_idx], true, 4.8, r1_impact, r1_comm, r1_trans, r1_exp, r1_text,
        (FLOOR(RANDOM() * 9 + 1) * 100)::numeric, FLOOR(RANDOM() * 30 + 5)::integer,
        NOW() - (FLOOR(RANDOM() * 60 + 10)::integer || ' days')::interval),
      (charity_rec.id, names[name_idx + 1], true, 4.3, r2_impact, r2_comm, r2_trans, r2_exp, r2_text,
        (FLOOR(RANDOM() * 5 + 1) * 100)::numeric, FLOOR(RANDOM() * 20 + 3)::integer,
        NOW() - (FLOOR(RANDOM() * 120 + 30)::integer || ' days')::interval),
      (charity_rec.id, names[name_idx + 2], true, 4.8, r3_impact, r3_comm, r3_trans, r3_exp, r3_text,
        (FLOOR(RANDOM() * 20 + 5) * 100)::numeric, FLOOR(RANDOM() * 35 + 8)::integer,
        NOW() - (FLOOR(RANDOM() * 180 + 60)::integer || ' days')::interval);
  END LOOP;
END $$;
