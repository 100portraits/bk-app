-- Migration: Make timeslots flexible to support any day and time
-- This migration removes the day_of_week constraint to allow any day of the week

-- Step 1: Drop the existing check constraint on day_of_week
ALTER TABLE public.shifts 
DROP CONSTRAINT IF EXISTS shifts_day_of_week_check;

-- Step 2: Update the day_of_week column to accept any day
-- The column already exists as text, we just removed the constraint
-- Now it can accept: 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'

-- Step 3: Add a new check constraint for valid day names
ALTER TABLE public.shifts 
ADD CONSTRAINT shifts_day_of_week_check 
CHECK (day_of_week = ANY (ARRAY[
  'monday'::text, 
  'tuesday'::text, 
  'wednesday'::text, 
  'thursday'::text, 
  'friday'::text, 
  'saturday'::text, 
  'sunday'::text
]));

-- Step 4: Add index for better query performance on date and day_of_week
CREATE INDEX IF NOT EXISTS idx_shifts_date_day ON public.shifts(date, day_of_week);
CREATE INDEX IF NOT EXISTS idx_shifts_is_open ON public.shifts(is_open) WHERE is_open = true;