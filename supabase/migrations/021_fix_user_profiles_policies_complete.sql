-- Create new RLS policies for user_profiles table
-- Assumes all existing policies have been dropped manually

-- 1. Everyone can view all profiles (needed for team page and user lookups)
CREATE POLICY "Anyone can view profiles" ON public.user_profiles
  FOR SELECT
  USING (true);

-- 2. Users can update their own profile (all fields including member status)
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Admins can update any user's profile (including role changes)
-- Using subquery to avoid recursion issues
CREATE POLICY "Admins can update any profile" ON public.user_profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  );

-- 5. Admins can delete profiles (if needed for cleanup)
CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  );

-- 6. Service role bypass for system operations
CREATE POLICY "Service role bypass" ON public.user_profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');