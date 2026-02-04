-- Remove permissive INSERT and UPDATE policies (import is complete)
DROP POLICY "Anyone can insert charities" ON public.charities;
DROP POLICY "Anyone can update charities" ON public.charities;