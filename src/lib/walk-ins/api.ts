import { createClient } from '@/lib/supabase/client';
import { WalkIn, CreateWalkInInput, UpdateWalkInInput } from '@/types/walk-ins';
import { startOfDay, endOfDay } from 'date-fns';

export class WalkInsAPI {
  private supabase = createClient();

  /**
   * Create a new walk-in record
   */
  async createWalkIn(input: CreateWalkInInput): Promise<WalkIn> {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await this.supabase
      .from('walk_ins')
      .insert({
        created_by: user.id,
        is_community_member: input.is_community_member,
        amount_paid: input.is_community_member ? null : input.amount_paid,
        notes: input.notes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating walk-in:', error);
      throw error;
    }
    
    return data;
  }

  /**
   * Get walk-ins for a specific date
   */
  async getWalkInsByDate(date: Date): Promise<WalkIn[]> {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const { data, error } = await this.supabase
      .from('walk_ins')
      .select(`
        *,
        creator:user_profiles (
          email
        )
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching walk-ins:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Get all walk-ins with pagination
   */
  async getWalkIns(limit: number = 50, offset: number = 0): Promise<WalkIn[]> {
    const { data, error } = await this.supabase
      .from('walk_ins')
      .select(`
        *,
        creator:user_profiles (
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching walk-ins:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Update a walk-in record
   */
  async updateWalkIn(id: string, input: UpdateWalkInInput): Promise<WalkIn> {
    const updateData: Partial<{
      is_community_member: boolean;
      amount_paid: number | null;
      notes: string | null;
    }> = {};
    
    if (input.is_community_member !== undefined) {
      updateData.is_community_member = input.is_community_member;
      // If changing to community member, clear the amount
      if (input.is_community_member) {
        updateData.amount_paid = null;
      }
    }
    
    if (input.amount_paid !== undefined) {
      updateData.amount_paid = input.amount_paid;
    }
    
    if (input.notes !== undefined) {
      updateData.notes = input.notes;
    }

    const { data, error } = await this.supabase
      .from('walk_ins')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating walk-in:', error);
      throw error;
    }
    
    return data;
  }

  /**
   * Delete a walk-in record (admin only)
   */
  async deleteWalkIn(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('walk_ins')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting walk-in:', error);
      throw error;
    }
  }

  /**
   * Get walk-in statistics for a date range
   */
  async getWalkInStats(startDate: Date, endDate: Date): Promise<{
    total: number;
    communityMembers: number;
    paidCustomers: number;
    totalRevenue: number;
  }> {
    const { data, error } = await this.supabase
      .from('walk_ins')
      .select('is_community_member, amount_paid')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (error) {
      console.error('Error fetching walk-in stats:', error);
      throw error;
    }
    
    const stats = (data || []).reduce((acc, walkIn) => {
      acc.total++;
      if (walkIn.is_community_member) {
        acc.communityMembers++;
      } else {
        acc.paidCustomers++;
        acc.totalRevenue += walkIn.amount_paid || 0;
      }
      return acc;
    }, {
      total: 0,
      communityMembers: 0,
      paidCustomers: 0,
      totalRevenue: 0
    });
    
    return stats;
  }
}