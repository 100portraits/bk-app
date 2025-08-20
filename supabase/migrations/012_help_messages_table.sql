-- Create help_messages table
CREATE TABLE help_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) NOT NULL,
  page_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  read_at TIMESTAMPTZ,
  response TEXT,
  responded_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX idx_help_messages_user_id ON help_messages(user_id);
CREATE INDEX idx_help_messages_created_at ON help_messages(created_at DESC);
CREATE INDEX idx_help_messages_page_name ON help_messages(page_name);

-- Add RLS policies
ALTER TABLE help_messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to create their own help messages
CREATE POLICY "Users can create own help messages" ON help_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to view their own help messages
CREATE POLICY "Users can view own help messages" ON help_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for admins to view all help messages
CREATE POLICY "Admins can view all help messages" ON help_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy for admins to update help messages (to add responses)
CREATE POLICY "Admins can update help messages" ON help_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );