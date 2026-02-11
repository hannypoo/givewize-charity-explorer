-- Add target_population_size column for coverage-based impact scoring
ALTER TABLE charities ADD COLUMN IF NOT EXISTS target_population_size bigint;

-- Populate target_population_size with researched estimates
-- Only charities with reasonable population estimates are updated; others remain NULL (fallback to raw headcount scoring)

-- Rare Diseases
UPDATE charities SET target_population_size = 500 WHERE name = 'Nicolaides-Baraitser Syndrome Support & Research';
UPDATE charities SET target_population_size = 30000000 WHERE name = 'National Organization for Rare Disorders (NORD)';

-- Medical & Health
UPDATE charities SET target_population_size = 100000000 WHERE name = 'Direct Relief';
UPDATE charities SET target_population_size = 15000 WHERE name = 'St. Jude Children''s Research Hospital';
UPDATE charities SET target_population_size = 200000000 WHERE name = 'Doctors Without Borders (MSF)';
UPDATE charities SET target_population_size = 500000 WHERE name = 'Seattle Children''s Hospital';

-- Education
UPDATE charities SET target_population_size = 100000000 WHERE name = 'Khan Academy';
UPDATE charities SET target_population_size = 2500000 WHERE name = 'DonorsChoose';
UPDATE charities SET target_population_size = 50000000 WHERE name = 'Teach For America';
UPDATE charities SET target_population_size = 250000000 WHERE name = 'Room to Read';
UPDATE charities SET target_population_size = 100000000 WHERE name = 'Pencils of Promise';

-- Hunger & Food Security
UPDATE charities SET target_population_size = 44000000 WHERE name = 'Feeding America';
UPDATE charities SET target_population_size = 13000000 WHERE name = 'No Kid Hungry';
UPDATE charities SET target_population_size = 12000000 WHERE name = 'Meals on Wheels America';

-- Animal Welfare
UPDATE charities SET target_population_size = 70000000 WHERE name = 'ASPCA';
UPDATE charities SET target_population_size = 500000000 WHERE name = 'World Wildlife Fund';
UPDATE charities SET target_population_size = 4000000 WHERE name = 'Best Friends Animal Society';
UPDATE charities SET target_population_size = 70000000 WHERE name = 'The Humane Society of the United States';

-- Child Welfare
UPDATE charities SET target_population_size = 27000 WHERE name = 'Make-A-Wish Foundation of America';

-- Environment & Climate
UPDATE charities SET target_population_size = 1000000000 WHERE name = 'The Nature Conservancy';
UPDATE charities SET target_population_size = 330000000 WHERE name = 'Sierra Club Foundation';
UPDATE charities SET target_population_size = 100000000 WHERE name = 'Rainforest Alliance';
UPDATE charities SET target_population_size = 3000000000 WHERE name = 'Ocean Conservancy';
UPDATE charities SET target_population_size = 330000000 WHERE name = 'Environmental Defense Fund';

-- Emergency Relief
UPDATE charities SET target_population_size = 330000000 WHERE name = 'American Red Cross';
UPDATE charities SET target_population_size = 100000000 WHERE name = 'International Rescue Committee';
UPDATE charities SET target_population_size = 50000000 WHERE name = 'Team Rubicon';

-- Mental Health
UPDATE charities SET target_population_size = 60000000 WHERE name = 'National Alliance on Mental Illness (NAMI)';
UPDATE charities SET target_population_size = 20000000 WHERE name = 'Crisis Text Line';
UPDATE charities SET target_population_size = 1800000 WHERE name = 'The Trevor Project';

-- Human Rights
UPDATE charities SET target_population_size = 330000000 WHERE name = 'ACLU';
UPDATE charities SET target_population_size = 2000000000 WHERE name = 'Human Rights Watch';
UPDATE charities SET target_population_size = 330000000 WHERE name = 'Southern Poverty Law Center';
