-- Add mechanics and hosts arrays to shifts table
ALTER TABLE public.shifts 
ADD COLUMN IF NOT EXISTS mechanics JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS hosts JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shifts_mechanics ON public.shifts USING gin(mechanics);
CREATE INDEX IF NOT EXISTS idx_shifts_hosts ON public.shifts USING gin(hosts);

-- Update RLS policies to allow hosts and mechanics to update their own signups

-- Drop existing update policy
DROP POLICY IF EXISTS "Only admins can update shifts" ON public.shifts;

-- Create new update policy that allows:
-- 1. Admins to update everything
-- 2. Hosts/mechanics to update only the mechanics/hosts arrays
CREATE POLICY "Admins can update all shift fields" ON public.shifts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow hosts and mechanics to view all shifts (not just open ones)
DROP POLICY IF EXISTS "Anyone can view open shifts" ON public.shifts;

CREATE POLICY "Anyone can view shifts" ON public.shifts
  FOR SELECT
  USING (true);

-- Function to add a user to a shift
CREATE OR REPLACE FUNCTION public.add_user_to_shift(
  shift_id UUID,
  user_email TEXT,
  user_name TEXT,
  shift_role TEXT -- 'mechanic' or 'host'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_array JSONB;
  user_obj JSONB;
  user_profile RECORD;
BEGIN
  -- Get user profile to check permissions
  SELECT * INTO user_profile 
  FROM public.user_profiles 
  WHERE id = auth.uid();
  
  -- Check if user has the right role
  IF shift_role = 'mechanic' AND user_profile.role NOT IN ('mechanic', 'admin') THEN
    RAISE EXCEPTION 'Only mechanics or admins can sign up as mechanics';
  END IF;
  
  IF shift_role = 'host' AND user_profile.role NOT IN ('host', 'mechanic', 'admin') THEN
    RAISE EXCEPTION 'Only hosts, mechanics, or admins can sign up as hosts';
  END IF;
  
  -- Create user object
  user_obj := jsonb_build_object(
    'id', auth.uid(),
    'email', user_email,
    'name', user_name,
    'added_at', NOW()
  );
  
  -- Get current array
  IF shift_role = 'mechanic' THEN
    SELECT mechanics INTO current_array FROM public.shifts WHERE id = shift_id;
  ELSE
    SELECT hosts INTO current_array FROM public.shifts WHERE id = shift_id;
  END IF;
  
  -- Check if user is already in the array
  IF current_array @> jsonb_build_array(jsonb_build_object('id', auth.uid())) THEN
    RETURN FALSE; -- User already signed up
  END IF;
  
  -- Add user to array
  current_array := current_array || user_obj;
  
  -- Update the shift
  IF shift_role = 'mechanic' THEN
    UPDATE public.shifts SET mechanics = current_array WHERE id = shift_id;
  ELSE
    UPDATE public.shifts SET hosts = current_array WHERE id = shift_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove a user from a shift
CREATE OR REPLACE FUNCTION public.remove_user_from_shift(
  shift_id UUID,
  user_id UUID,
  shift_role TEXT -- 'mechanic' or 'host'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_array JSONB;
  new_array JSONB;
BEGIN
  -- Check if the user is removing themselves or is an admin
  IF auth.uid() != user_id AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'You can only remove yourself from shifts';
  END IF;
  
  -- Get current array
  IF shift_role = 'mechanic' THEN
    SELECT mechanics INTO current_array FROM public.shifts WHERE id = shift_id;
  ELSE
    SELECT hosts INTO current_array FROM public.shifts WHERE id = shift_id;
  END IF;
  
  -- Remove user from array
  SELECT jsonb_agg(elem)
  INTO new_array
  FROM jsonb_array_elements(current_array) elem
  WHERE elem->>'id' != user_id::TEXT;
  
  -- If new_array is null, set it to empty array
  IF new_array IS NULL THEN
    new_array := '[]'::jsonb;
  END IF;
  
  -- Update the shift
  IF shift_role = 'mechanic' THEN
    UPDATE public.shifts SET mechanics = new_array WHERE id = shift_id;
  ELSE
    UPDATE public.shifts SET hosts = new_array WHERE id = shift_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;