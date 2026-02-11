-- Fix remaining broken/invisible charity logos (round 2)

-- All Hands and Hearts: white SVG invisible on light backgrounds, use og:image instead
UPDATE charities SET logo_url = 'https://allhandsandhearts.org/wp-content/uploads/2025/08/open-graph-image-1024x680.png'
WHERE name = 'All Hands and Hearts';

-- American Heart Association: previous Wikipedia URL was 404
UPDATE charities SET logo_url = 'https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c51e.png'
WHERE name = 'American Heart Association';

-- NORD: rarediseases.org blocks non-browser requests (403)
UPDATE charities SET logo_url = 'https://iconape.com/wp-content/png_logo_vector/nord-logo.png'
WHERE name = 'National Organization for Rare Disorders (NORD)';

-- No Kid Hungry: previous Wikipedia URL was 404
UPDATE charities SET logo_url = 'https://iconape.com/wp-content/png_logo_vector/no-kid-hungry-logo.png'
WHERE name = 'No Kid Hungry';
