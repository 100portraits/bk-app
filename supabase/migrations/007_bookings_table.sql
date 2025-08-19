-- Create bookings table for appointment scheduling
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
  slot_time TIME NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes IN (30, 40, 45, 60)),
  repair_type TEXT NOT NULL CHECK (repair_type IN ('tire_tube', 'chain', 'brakes', 'gears', 'wheel', 'other')),
  repair_details JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_shift_id ON bookings(shift_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_slot_time ON bookings(shift_id, slot_time);

-- Add unique constraint to prevent double booking of slots
CREATE UNIQUE INDEX idx_bookings_unique_slot ON bookings(shift_id, slot_time) 
WHERE status != 'cancelled';

-- Update shifts table to track booking count
ALTER TABLE shifts 
ADD COLUMN IF NOT EXISTS current_bookings INT DEFAULT 0;

-- Create function to update booking count on shifts
CREATE OR REPLACE FUNCTION update_shift_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status != 'cancelled' THEN
    UPDATE shifts 
    SET current_bookings = current_bookings + 1 
    WHERE id = NEW.shift_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If status changed to cancelled
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE shifts 
      SET current_bookings = current_bookings - 1 
      WHERE id = NEW.shift_id;
    -- If status changed from cancelled to something else
    ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
      UPDATE shifts 
      SET current_bookings = current_bookings + 1 
      WHERE id = NEW.shift_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
    UPDATE shifts 
    SET current_bookings = current_bookings - 1 
    WHERE id = OLD.shift_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking count updates
CREATE TRIGGER trigger_update_shift_booking_count
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_shift_booking_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_bookings_updated_at();

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (cancel)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins and mechanics can view all bookings
CREATE POLICY "Staff can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mechanic', 'host')
    )
  );

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );