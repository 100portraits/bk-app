import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/auth';

export interface TeamMember {
  id: string;
  email: string;
  member: boolean;
  role: UserRole;
  created_at: string;
}

export class TeamAPI {
  private supabase = createClient();

  /**
   * Get all team members (users with non-null roles)
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, email, member, role, created_at')
      .not('role', 'is', null)
      .order('role', { ascending: true })
      .order('email', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Update a user's role
   */
  async updateUserRole(userId: string, newRole: UserRole | null): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Remove a user from the team (set role to null)
   */
  async removeFromTeam(userId: string): Promise<void> {
    await this.updateUserRole(userId, null);
  }
}