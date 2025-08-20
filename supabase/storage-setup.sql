-- Run this in your Supabase SQL editor to set up the event-posters storage bucket

-- Create the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-posters',
  'event-posters',
  true, -- Make it public so images can be viewed
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view event posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload event posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event posters" ON storage.objects;

-- Allow anyone to view event posters (since they're public)
CREATE POLICY "Anyone can view event posters" ON storage.objects
FOR SELECT USING (
  bucket_id = 'event-posters'
);

-- Allow any authenticated user to upload event posters
-- (You can restrict this to admins only if needed)
CREATE POLICY "Authenticated users can upload event posters" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'event-posters'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update event posters" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'event-posters'
)
WITH CHECK (
  bucket_id = 'event-posters'
);

-- Allow authenticated users to delete event posters
CREATE POLICY "Authenticated users can delete event posters" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'event-posters'
);

-- If you want to restrict to admins only, use these policies instead:
-- (Uncomment the lines below and comment out the ones above)

-- CREATE POLICY "Authenticated users can upload event posters" ON storage.objects
-- FOR INSERT TO authenticated
-- WITH CHECK (
--   bucket_id = 'event-posters' AND
--   EXISTS (
--     SELECT 1 FROM public.user_profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );

-- CREATE POLICY "Authenticated users can update event posters" ON storage.objects
-- FOR UPDATE TO authenticated
-- USING (
--   bucket_id = 'event-posters' AND
--   EXISTS (
--     SELECT 1 FROM public.user_profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- )
-- WITH CHECK (
--   bucket_id = 'event-posters' AND
--   EXISTS (
--     SELECT 1 FROM public.user_profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );

-- CREATE POLICY "Authenticated users can delete event posters" ON storage.objects
-- FOR DELETE TO authenticated
-- USING (
--   bucket_id = 'event-posters' AND
--   EXISTS (
--     SELECT 1 FROM public.user_profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );