-- Refactor bookings to use a single email column for all bookings
-- This migration updates the existing guest_email column to be a general email column

-- First, drop the existing constraint that enforces either user_id or guest_email
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_user_or_guest_check;

-- Rename guest_email to email
ALTER TABLE public.bookings 
RENAME COLUMN guest_email TO email;

-- Make email NOT NULL (required for all bookings)
ALTER TABLE public.bookings 
ALTER COLUMN email SET NOT NULL;

-- Update the column comment
COMMENT ON COLUMN public.bookings.email IS 'Email address for booking confirmation (required for all bookings, can be different from account email)';

-- The existing policies should still work, but let's update them for clarity
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Authenticated users can create bookings with their user_id
    (auth.uid() IS NOT NULL AND user_id = (SELECT id FROM public.user_profiles WHERE id = auth.uid()))
    OR
    -- Anyone can create guest bookings (with null user_id and email)
    (user_id IS NULL AND email IS NOT NULL)
  );

-- No need to update the select policy as it remains the same