-- Add name column to bookings table for guest bookings
ALTER TABLE public.bookings 
ADD COLUMN name text;

-- Update the bookings table comment to document the name field
COMMENT ON COLUMN public.bookings.name IS 'Guest name for bookings without user accounts (optional for authenticated users)';