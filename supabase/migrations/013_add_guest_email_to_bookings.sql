-- Add email column to bookings table for all bookings (authenticated, guest, or custom email)
ALTER TABLE public.bookings 
ADD COLUMN email text NOT NULL;

-- Update RLS policies to allow guest bookings
-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;

-- Create new insert policy that allows both authenticated and guest bookings
CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (
    -- Authenticated users can create bookings with their user_id
    (auth.uid() IS NOT NULL AND user_id = (SELECT id FROM public.user_profiles WHERE id = auth.uid()))
    OR
    -- Anyone can create guest bookings (with null user_id)
    (user_id IS NULL)
  );

-- Update select policy to allow users to see their own bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users can view bookings" ON public.bookings
  FOR SELECT
  USING (
    -- Authenticated users can see their own bookings
    (auth.uid() IS NOT NULL AND user_id = (SELECT id FROM public.user_profiles WHERE id = auth.uid()))
    OR
    -- Staff can see all bookings
    (auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role IN ('admin', 'mechanic', 'host')
    ))
  );

-- Update the bookings table comment to document the email field
COMMENT ON COLUMN public.bookings.email IS 'Email address for booking confirmation (can be different from account email)';