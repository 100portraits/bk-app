-- Enhanced script to fix guest booking permissions
-- This version ensures guest bookings work even without authentication

-- Step 1: Check current RLS status
SELECT 
  'Current RLS Status' as check_type,
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Step 2: List all existing policies before dropping
SELECT 
  'Existing Policies (before)' as check_type,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Step 3: Drop ALL existing policies (comprehensive list)
DO $$ 
BEGIN
  -- Drop any policy that might exist
  DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can view bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users and staff can view bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
END $$;

-- Step 4: Create a single, simple INSERT policy for guest bookings
-- This explicitly allows inserts when there's no authentication
CREATE POLICY "Allow all bookings including guests" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Allow everything: authenticated users and guests
    -- Authenticated users should have matching user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Guests have no auth but must provide email
    (auth.uid() IS NULL AND user_id IS NULL AND email IS NOT NULL)
    OR
    -- Edge case: authenticated user creating a guest booking (e.g., admin creating for someone)
    (auth.uid() IS NOT NULL AND user_id IS NULL AND email IS NOT NULL)
  );

-- Step 5: Create SELECT policy
CREATE POLICY "View bookings policy" ON public.bookings
  FOR SELECT
  USING (
    -- Users can see their own bookings
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Staff can see all bookings
    (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid()
      AND role IN ('admin', 'mechanic', 'host')
    ))
    OR
    -- Allow viewing if no auth (for testing - remove in production if needed)
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Step 6: Create UPDATE policy for authenticated users
CREATE POLICY "Update own bookings" ON public.bookings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Step 7: Create DELETE policy for admins
CREATE POLICY "Admin delete bookings" ON public.bookings
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Step 8: Create admin override for all operations
CREATE POLICY "Admin full access" ON public.bookings
  FOR ALL
  USING (
    auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Step 9: Verify the new policies
SELECT 
  'New Policies (after)' as check_type,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
ORDER BY policyname;

-- Step 10: Test if guest bookings are allowed
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'Guest bookings are ENABLED ✓'
    ELSE 'Guest bookings are DISABLED ✗'
  END as status,
  COUNT(*) as matching_policies
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
AND policyname = 'Allow all bookings including guests'
AND (
  with_check LIKE '%auth.uid() IS NULL%' 
  OR with_check LIKE '%user_id IS NULL AND email IS NOT NULL%'
);

-- Step 11: Additional diagnostic - show the exact policy text
SELECT 
  'INSERT Policy Details' as check_type,
  policyname,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
AND cmd = 'INSERT';

-- Step 12: Test insert capability (this will not actually insert, just check if it would be allowed)
-- This simulates a guest booking attempt
SELECT 
  CASE 
    WHEN has_table_privilege('anon', 'public.bookings', 'INSERT') THEN 'Anonymous INSERT is ALLOWED ✓'
    ELSE 'Anonymous INSERT is BLOCKED ✗'
  END as anon_insert_status;

-- Step 13: Check if anon role exists and is configured properly
SELECT 
  'Anon Role Status' as check_type,
  rolname,
  rolcanlogin,
  rolsuper
FROM pg_roles 
WHERE rolname = 'anon';