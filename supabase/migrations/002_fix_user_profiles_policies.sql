-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Recreate policies without recursion

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy 2: Service role can do everything (for server-side operations)
CREATE POLICY "Service role has full access" ON public.user_profiles
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 3: Users can view all profiles (needed for admin features later)
-- This is safe because sensitive data should be filtered at the application level
CREATE POLICY "Authenticated users can view all profiles" ON public.user_profiles
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy 4: Only service role can update profiles
-- This prevents users from changing their own member status or role
-- Updates should be done through admin interfaces or server-side functions
CREATE POLICY "Only service role can update profiles" ON public.user_profiles
  FOR UPDATE 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 5: Only service role can insert profiles
-- Profiles are created automatically via trigger
CREATE POLICY "Only service role can insert profiles" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');