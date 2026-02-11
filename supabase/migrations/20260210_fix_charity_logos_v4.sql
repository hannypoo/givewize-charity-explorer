-- Fix charity logos invisible on white card backgrounds (round 4)
-- Logo container is bg-white, so any white-on-transparent logo is invisible.

-- Make-A-Wish Foundation: SVG was 100% white fill; use colored Wikimedia PNG (blue)
UPDATE charities SET logo_url = 'https://upload.wikimedia.org/wikipedia/commons/5/58/MAW_Standard_RGB.png'
WHERE name = 'Make-A-Wish Foundation of America';

-- Room to Read: was using "lightgrey" variant; swap to full-color version
UPDATE charities SET logo_url = 'https://www.roomtoread.org/media/d1ohgobj/rtr-logo-primary-rgb-fullcolorlarge.png'
WHERE name = 'Room to Read';

-- Prostate Cancer Foundation: white+orange "Reverse" PNG for dark backgrounds; use apple-touch-icon
UPDATE charities SET logo_url = 'https://www.pcf.org/apple-touch-icon.png'
WHERE name = 'Prostate Cancer Foundation';

-- The Arc: white "Rev" (reversed) PNG; use colored footer logo (orange arc + black text)
UPDATE charities SET logo_url = 'https://thearc.org/wp-content/uploads/2018/12/arc-footer-logo.png'
WHERE name = 'The Arc of the United States';

-- NORD: iconape logo was for wrong org (French "Nord le Departement"); use actual NORD logo
UPDATE charities SET logo_url = 'https://rarediseases.org/wp-content/uploads/2024/09/nord-logo-wide-white-1200.jpg'
WHERE name = 'National Organization for Rare Disorders (NORD)';
