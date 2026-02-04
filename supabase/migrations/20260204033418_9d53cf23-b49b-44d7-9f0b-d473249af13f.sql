-- Add INSERT policy for charities (admin seeding)
CREATE POLICY "Anyone can insert charities" ON public.charities FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for charities (for upsert to work)  
CREATE POLICY "Anyone can update charities" ON public.charities FOR UPDATE USING (true);