-- Add link column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN events.link IS 'Optional external link for the event (e.g., registration, more info)';