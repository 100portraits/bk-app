-- Migration: Remove unused capacity fields from shifts and events tables
-- We don't use capacity tracking, so removing these fields to simplify

-- Drop the capacity-related columns from shifts table
ALTER TABLE public.shifts 
DROP COLUMN IF EXISTS max_capacity,
DROP COLUMN IF EXISTS current_bookings;

-- Drop the capacity column from events table
ALTER TABLE public.events
DROP COLUMN IF EXISTS max_capacity;