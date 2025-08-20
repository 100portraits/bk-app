-- Fix RLS policies for guest bookings
-- This ensures guest bookings (without authentication) can be created

-- First, drop all existing conflicting policies
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;

-- Create a comprehensive insert policy that allows:
-- 1. Authenticated users to create bookings with their user_id
-- 2. Anyone (including unauthenticated) to create guest bookings
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Authenticated users must use their own user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Guest bookings (no authentication required, must have email)
    (user_id IS NULL AND email IS NOT NULL)
  );

-- Create select policy that allows:
-- 1. Authenticated users to see their own bookings
-- 2. Guest bookings are only viewable by staff
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

-- Update policy: only authenticated users can update their own bookings
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Keep existing staff/admin policies
-- (These should already exist from migration 007)