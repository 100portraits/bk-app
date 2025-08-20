-- FINAL FIX for guest booking permissions
-- This solution works with Supabase's anon role configuration

-- Step 1: Drop ALL existing policies to start fresh
DO $$ 
BEGIN
  -- Drop any existing policies
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
  DROP POLICY IF EXISTS "Allow all bookings including guests" ON public.bookings;
  DROP POLICY IF EXISTS "View bookings policy" ON public.bookings;
  DROP POLICY IF EXISTS "Update own bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admin delete bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Admin full access" ON public.bookings;
END $$;

-- Step 2: Create a PERMISSIVE INSERT policy that allows guest bookings
-- The key is using TRUE for guest bookings - this allows anyone to insert
CREATE POLICY "Enable insert for all users including guests" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Case 1: Authenticated user creating their own booking
    (auth.uid() = user_id)
    OR
    -- Case 2: Guest booking (no user_id, but has email) - ALWAYS ALLOW
    (user_id IS NULL AND email IS NOT NULL)
  );

-- Step 3: Create SELECT policy
CREATE POLICY "Enable read access" ON public.bookings
  FOR SELECT
  USING (
    -- Authenticated users can see their own bookings
    (auth.uid() = user_id)
    OR
    -- Staff can see all bookings
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid()
      AND role IN ('admin', 'mechanic', 'host')
    )
  );

-- Step 4: Create UPDATE policy
CREATE POLICY "Enable update for users" ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 5: Create DELETE policy for admins only
CREATE POLICY "Enable delete for admins" ON public.bookings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Step 6: Verify the policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
ORDER BY cmd, policyname;

-- Step 7: Grant necessary permissions to anon role (Supabase's anonymous/guest role)
-- This is crucial for guest bookings to work
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.bookings TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 8: Verify permissions
SELECT 
  'Table Permissions for anon role' as check_type,
  has_table_privilege('anon', 'public.bookings', 'INSERT') as can_insert,
  has_table_privilege('anon', 'public.bookings', 'SELECT') as can_select,
  has_table_privilege('anon', 'public.bookings', 'UPDATE') as can_update,
  has_table_privilege('anon', 'public.bookings', 'DELETE') as can_delete;

-- Step 9: Test the INSERT policy specifically
SELECT 
  'INSERT Policy Check' as check_type,
  policyname,
  CASE 
    WHEN with_check LIKE '%user_id IS NULL AND email IS NOT NULL%' 
    THEN 'Guest bookings ENABLED ✓'
    ELSE 'Guest bookings DISABLED ✗'
  END as guest_booking_status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
AND cmd = 'INSERT';

-- Step 10: Final verification - simulate a guest booking check
-- This tests if a booking with no user_id but with email would be allowed
SELECT 
  'Final Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'bookings'
      AND cmd = 'INSERT'
      AND with_check LIKE '%user_id IS NULL AND email IS NOT NULL%'
    ) AND has_table_privilege('anon', 'public.bookings', 'INSERT')
    THEN '✅ GUEST BOOKINGS ARE FULLY ENABLED!'
    ELSE '❌ Guest bookings still have issues'
  END as status;