-- Add member column to bookings table
ALTER TABLE bookings
ADD COLUMN is_member BOOLEAN DEFAULT false NOT NULL;

-- Add index for filtering by member status
CREATE INDEX idx_bookings_is_member ON bookings(is_member);

-- Update existing bookings to set member status based on user profiles
UPDATE bookings b
SET is_member = COALESCE(p.member, false)
FROM profiles p
WHERE b.user_id = p.id;