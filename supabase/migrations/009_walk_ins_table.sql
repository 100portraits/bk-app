-- Create walk_ins table
CREATE TABLE walk_ins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_by UUID REFERENCES user_profiles(id) NOT NULL,
  is_community_member BOOLEAN NOT NULL DEFAULT false,
  amount_paid DECIMAL(10, 2), -- NULL for community members
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes
CREATE INDEX idx_walk_ins_created_at ON walk_ins(created_at DESC);
CREATE INDEX idx_walk_ins_created_by ON walk_ins(created_by);
CREATE INDEX idx_walk_ins_is_community_member ON walk_ins(is_community_member);

-- Add RLS policies
ALTER TABLE walk_ins ENABLE ROW LEVEL SECURITY;

-- Policy for hosts/mechanics/admins to insert walk-ins
CREATE POLICY "Staff can create walk-ins" ON walk_ins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('host', 'mechanic', 'admin')
    )
  );

-- Policy for staff to view all walk-ins
CREATE POLICY "Staff can view walk-ins" ON walk_ins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('host', 'mechanic', 'admin')
    )
  );

-- Policy for staff to update walk-ins
CREATE POLICY "Staff can update walk-ins" ON walk_ins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('host', 'mechanic', 'admin')
    )
  );

-- Policy for admins to delete walk-ins
CREATE POLICY "Admins can delete walk-ins" ON walk_ins
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_walk_ins_updated_at
  BEFORE UPDATE ON walk_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();