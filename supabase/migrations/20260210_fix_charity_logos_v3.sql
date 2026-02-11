-- Fix remaining broken/invisible charity logos (round 3)
-- Root cause: white-on-transparent SVGs invisible on light card backgrounds,
-- hotlink-blocked URLs, and partially-visible inverted color variants.

-- American Heart Association: stickpng was hotlink-blocked in browsers
UPDATE charities SET logo_url = 'https://www.heart.org/-/media/Images/Logos/Global-Do-No-Edit/Header/AHA_Full.svg'
WHERE name = 'American Heart Association';

-- National Domestic Violence Hotline: SVG with colored fill (purple + dark gray + red)
UPDATE charities SET logo_url = 'https://www.thehotline.org/wp-content/themes/hotline-main/assets/images/logo-ndvh.svg'
WHERE name = 'National Domestic Violence Hotline';

-- Ocean Conservancy: old SVG was white-on-transparent; use colored aqua+navy PNG
UPDATE charities SET logo_url = 'https://oceanconservancy.org/wp-content/uploads/2025/07/OC-Vertical-Stacked-Aqua-Navy_Logo_2023.png'
WHERE name = 'Ocean Conservancy';

-- Rare Disease Foundation: was using "biwh" (bilingual white) variant; switch to "bibl" (bilingual black)
UPDATE charities SET logo_url = 'https://rarediseasefoundation.org/wp-content/uploads/2023/08/RareDiseaseFoundation-bibl.png'
WHERE name = 'Rare Disease Foundation';

-- Single Parent Scholarship Fund: reversal SVG was white text on transparent; use apple-touch-icon
UPDATE charities SET logo_url = 'https://aspsf.org/wp-content/uploads/2026/01/Apple-Touch-Icon.png'
WHERE name = 'Single Parent Scholarship Fund';

-- Zero Abuse Project: SVG was white on transparent; use colored JPG logo (300x300)
UPDATE charities SET logo_url = 'https://zeroabuseproject.org/wp-content/uploads/2019/03/logo-zero-abuse-project1-1.jpg'
WHERE name = 'Zero Abuse Project';
