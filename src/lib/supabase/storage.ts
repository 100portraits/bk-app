import { supabase } from './singleton-client';

const BUCKET_NAME = 'event-posters';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function uploadEventPoster(file: File): Promise<{ url: string | null; error: string | null }> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'File size must be less than 5MB' };
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `posters/${fileName}`;

  try {
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (err) {
    console.error('Upload exception:', err);
    return { url: null, error: 'Failed to upload image' };
  }
}

export async function deleteEventPoster(url: string): Promise<{ success: boolean; error: string | null }> {
  if (!url || !url.includes(BUCKET_NAME)) {
    return { success: false, error: 'Invalid poster URL' };
  }

  try {
    // Extract file path from URL
    const urlParts = url.split(`${BUCKET_NAME}/`);
    if (urlParts.length !== 2) {
      return { success: false, error: 'Could not extract file path from URL' };
    }
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Delete exception:', err);
    return { success: false, error: 'Failed to delete image' };
  }
}