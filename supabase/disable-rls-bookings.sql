-- OPTION 1: Temporarily disable RLS on bookings table
-- WARNING: This removes all row-level security. Use with caution!

-- Check current RLS status
SELECT 
  'Current Status' as info,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Disable RLS on bookings table
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  'New Status' as info,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN NOT rowsecurity THEN '✅ RLS DISABLED - Guest bookings will work now!'
    ELSE '❌ RLS still enabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Note: To re-enable RLS later, run:
-- ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;