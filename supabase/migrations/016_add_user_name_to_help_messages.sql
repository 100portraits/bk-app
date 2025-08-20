-- Add user_name field to help_messages table
ALTER TABLE public.help_messages 
ADD COLUMN user_name text;

-- Update existing messages to include user names from profiles
UPDATE public.help_messages hm
SET user_name = up.name
FROM public.user_profiles up
WHERE hm.user_id = up.id
AND hm.user_name IS NULL;

-- Make user_id nullable to support anonymous messages  
ALTER TABLE public.help_messages 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy for anonymous messages
DROP POLICY IF EXISTS "Users can create own help messages" ON public.help_messages;

CREATE POLICY "Users can create help messages" ON public.help_messages
  FOR INSERT
  WITH CHECK (
    -- Allow authenticated users to create messages with their user_id
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR 
    -- Allow anonymous messages (no user_id)
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    -- Allow authenticated users to create anonymous messages
    (auth.uid() IS NOT NULL AND user_id IS NULL)
  );

-- Add comment
COMMENT ON COLUMN public.help_messages.user_name IS 'Display name of the user who sent the message';