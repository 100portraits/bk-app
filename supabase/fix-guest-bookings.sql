-- Script to fix guest booking permissions
-- Run this in the Supabase SQL editor to immediately fix guest booking issues

-- First, check if RLS is enabled on bookings table
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookings';

-- Drop all existing booking policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;

-- Create new comprehensive policies

-- 1. INSERT: Allow both authenticated and guest bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Authenticated users must use their own user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Guest bookings (no authentication required, must have email)
    (user_id IS NULL AND email IS NOT NULL)
  );

-- 2. SELECT: Users see own bookings, staff see all
CREATE POLICY "Users and staff can view bookings" ON public.bookings
  FOR SELECT
  USING (
    -- Authenticated users can see their own bookings
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Staff can see all bookings
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid()
      AND role IN ('admin', 'mechanic', 'host')
    )
  );

-- 3. UPDATE: Only authenticated users can update their own bookings
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 4. DELETE: Only admins can delete bookings
CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- 5. Admin override: Admins can do everything
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
ORDER BY policyname;

-- Test: This should return true if guest bookings are allowed
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'Guest bookings are ENABLED ✓'
    ELSE 'Guest bookings are DISABLED ✗'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'bookings'
AND policyname = 'Anyone can create bookings'
AND with_check LIKE '%user_id IS NULL AND email IS NOT NULL%';