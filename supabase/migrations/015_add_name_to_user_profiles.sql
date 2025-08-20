-- Add name field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN name text;

-- Update the column comment
COMMENT ON COLUMN public.user_profiles.name IS 'Display name for the user';

-- Update existing profiles to use email username as default name (before @ symbol)
UPDATE public.user_profiles 
SET name = split_part(email, '@', 1)
WHERE name IS NULL;

-- Make name required for future entries
ALTER TABLE public.user_profiles 
ALTER COLUMN name SET NOT NULL;

-- Update the insert trigger to set default name from email if not provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, member, role)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    false,
    null
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to allow users to update their own name
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);