-- Add policy to allow users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);