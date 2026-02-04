-- Create enum for geographic scope
CREATE TYPE public.geographic_scope AS ENUM ('local', 'national', 'global');

-- Create enum for cause categories
CREATE TYPE public.cause_category AS ENUM (
  'rare-diseases',
  'medical-health',
  'education',
  'hunger-food-security',
  'animal-welfare',
  'child-welfare',
  'environment-climate',
  'emergency-relief',
  'housing-homelessness',
  'mental-health',
  'veterans',
  'arts-culture',
  'human-rights',
  'disability-services',
  'senior-services',
  'community-development',
  'faith-based',
  'international-development'
);

-- Create charities table
CREATE TABLE public.charities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic info
  name TEXT NOT NULL,
  ein TEXT UNIQUE, -- Employer Identification Number
  website TEXT,
  year_founded INTEGER,
  logo_url TEXT,
  
  -- Classification
  primary_category cause_category NOT NULL,
  mission_statement TEXT,
  geographic_scope geographic_scope NOT NULL DEFAULT 'national',
  
  -- Location
  headquarters TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Programs
  full_description TEXT,
  programs_list TEXT[], -- Array of program names
  target_population TEXT,
  people_served_annually INTEGER,
  
  -- Financials (percentages stored as decimals 0-100)
  program_expense_percentage NUMERIC(5,2),
  admin_expense_percentage NUMERIC(5,2),
  fundraising_expense_percentage NUMERIC(5,2),
  
  -- Transparency
  complete_990_filed BOOLEAN DEFAULT false,
  annual_report_url TEXT,
  financials_published BOOLEAN DEFAULT false,
  
  -- GiveWiZe Algorithm Scores (0-100)
  score_overall NUMERIC(4,1),
  score_financial_efficiency NUMERIC(4,1),
  score_transparency NUMERIC(4,1),
  score_longevity NUMERIC(4,1),
  score_impact NUMERIC(4,1),
  
  -- Community Rating
  community_rating_average NUMERIC(3,2), -- 0.00 to 5.00
  community_rating_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- Public read access (charities are public information)
CREATE POLICY "Anyone can view charities"
  ON public.charities
  FOR SELECT
  USING (true);

-- Create index for common queries
CREATE INDEX idx_charities_category ON public.charities(primary_category);
CREATE INDEX idx_charities_scope ON public.charities(geographic_scope);
CREATE INDEX idx_charities_name ON public.charities(name);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_charities_updated_at
  BEFORE UPDATE ON public.charities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();