-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create a new policy that explicitly allows users to update their own profile including member field
CREATE POLICY "Users can update own profile including member" ON public.user_profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);