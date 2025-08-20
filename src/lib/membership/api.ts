import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types/auth';

export class MembershipAPI {
  private supabase = createClient();

  /**
   * Update user's membership status
   */
  async updateMembershipStatus(isMember: boolean): Promise<UserProfile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }


    // First check if the profile exists
    const { data: existingProfile } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error if not found


    if (!existingProfile) {
      // If profile doesn't exist, create it
      const { data: newProfile, error: insertError } = await this.supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          member: isMember,
          role: null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }

      return newProfile;
    }

    // Update existing profile - use a different approach
    
    // First do the update without select
    const { error: updateError } = await this.supabase
      .from('user_profiles')
      .update({ member: isMember })
      .eq('id', user.id);
    
    if (updateError) {
      console.error('Error updating membership status:', updateError);
      throw updateError;
    }

    // Then fetch the updated profile
    const { data: updatedProfile, error: fetchUpdatedError } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchUpdatedError) {
      console.error('Error fetching updated profile:', fetchUpdatedError);
      throw fetchUpdatedError;
    }

    return updatedProfile;
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  }
}