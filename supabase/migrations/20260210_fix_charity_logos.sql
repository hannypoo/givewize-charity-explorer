-- Fix broken and missing charity logo URLs

-- American Heart Association: old URL returns HTML, not an image
UPDATE charities SET logo_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/American_Heart_Association_Logo.svg/250px-American_Heart_Association_Logo.svg.png'
WHERE name = 'American Heart Association';

-- Epilepsy Foundation: old URL returns 403
UPDATE charities SET logo_url = 'https://cdn.worldvectorlogo.com/logos/epilepsy-foundation.svg'
WHERE name = 'Epilepsy Foundation';

-- International Rescue Committee: old URL was 404
UPDATE charities SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/7/71/International_Rescue_Committee_Logo.svg'
WHERE name = 'International Rescue Committee';

-- Memorial Sloan Kettering Cancer Center: was missing logo
UPDATE charities SET logo_url = 'https://www.mskcc.org/logo.png'
WHERE name = 'Memorial Sloan Kettering Cancer Center';

-- No Kid Hungry: old URL was 404
UPDATE charities SET logo_url = 'https://upload.wikimedia.org/wikipedia/en/5/5c/No_Kid_Hungry_logo.svg'
WHERE name = 'No Kid Hungry';

-- Paget Foundation: was missing logo (merged with Bone Health & Osteoporosis Foundation)
UPDATE charities SET logo_url = 'https://www.bonehealthandosteoporosis.org/wp-content/uploads/cropped-output-onlinepngtools-180x180.png'
WHERE name = 'Paget Foundation';

-- Single Parent Scholarship Fund: was missing logo (Arkansas SPSF)
UPDATE charities SET logo_url = 'https://aspsf.org/wp-content/uploads/2025/09/aspsf_logo_reversal_red.svg'
WHERE name = 'Single Parent Scholarship Fund';

-- Southern Poverty Law Center: old URL was 404 (truncated hash in URL)
UPDATE charities SET logo_url = 'https://www.splcenter.org/wp-content/themes/splc-theme/patterns/images/svg/splc_logo.svg'
WHERE name = 'Southern Poverty Law Center';
