-- Add event_type column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'other';

-- Add check constraint for valid event types
ALTER TABLE events 
ADD CONSTRAINT valid_event_type 
CHECK (event_type IN ('ride_out', 'workshop', 'borrel', 'upcycling', 'other'));

-- Add comment for documentation
COMMENT ON COLUMN events.event_type IS 'Type of event: ride_out, workshop, borrel, upcycling, or other';