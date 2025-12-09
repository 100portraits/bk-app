-- Add phone column to user_profiles (optional for existing users)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add phone column to bookings (required for new bookings)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.phone IS 'User phone number (optional)';
COMMENT ON COLUMN bookings.phone IS 'Contact phone number for the booking';
