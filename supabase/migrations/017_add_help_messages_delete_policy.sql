-- Add delete policy for admins on help_messages table
CREATE POLICY "Admins can delete help messages" ON help_messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Also allow anonymous users to create help messages (for non-logged-in users)
CREATE POLICY "Anonymous users can create help messages" ON help_messages
  FOR INSERT
  WITH CHECK (user_id IS NULL);

-- Allow viewing of anonymous messages by admins
CREATE POLICY "Admins can view anonymous help messages" ON help_messages
  FOR SELECT
  USING (
    user_id IS NULL AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );