import { createClient } from '@/lib/supabase/client';
import { Shift, DayOfWeek, ShiftUser } from '@/types/shifts';
import { startOfWeek, endOfWeek, format, addWeeks } from 'date-fns';

export class ShiftsAPI {
  private supabase = createClient();

  /**
   * Get all shifts for a date range
   */
  async getShifts(startDate: Date, endDate: Date): Promise<Shift[]> {
    const { data, error } = await this.supabase
      .from('shifts')
      .select('*')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get shifts for a specific week
   */
  async getWeekShifts(date: Date): Promise<Shift[]> {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
    return this.getShifts(start, end);
  }

  /**
   * Toggle a shift's open status
   */
  async toggleShift(date: Date, dayOfWeek: DayOfWeek, startTime: string): Promise<void> {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if shift exists
    const { data: existing } = await this.supabase
      .from('shifts')
      .select('*')
      .eq('date', dateStr)
      .eq('day_of_week', dayOfWeek)
      .eq('start_time', startTime)
      .single();

    if (existing) {
      // Toggle the is_open status
      const { error } = await this.supabase
        .from('shifts')
        .update({ is_open: !existing.is_open })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating shift:', error);
        throw error;
      }
    } else {
      // Create new shift based on day
      let endTime = '18:00:00';
      if (dayOfWeek === 'monday') {
        startTime = '14:00:00';
        endTime = '18:00:00';
      } else if (dayOfWeek === 'wednesday') {
        startTime = '12:00:00';
        endTime = '16:00:00';
      } else if (dayOfWeek === 'thursday') {
        startTime = '16:00:00';
        endTime = '20:00:00';
      }

      const { error } = await this.supabase
        .from('shifts')
        .insert({
          date: dateStr,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_open: true,
        });

      if (error) {
        console.error('Error creating shift:', error);
        throw error;
      }
    }
  }


  /**
   * Delete a shift
   */
  async deleteShift(shiftId: string): Promise<void> {
    const { error } = await this.supabase
      .from('shifts')
      .delete()
      .eq('id', shiftId);

    if (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
  }

  /**
   * Update shift notes
   */
  async updateShiftNotes(shiftId: string, notes: string): Promise<void> {
    const { error } = await this.supabase
      .from('shifts')
      .update({ notes })
      .eq('id', shiftId);

    if (error) {
      console.error('Error updating shift notes:', error);
      throw error;
    }
  }

  /**
   * Sign up for a shift as a mechanic or host
   */
  async signUpForShift(shiftId: string, userEmail: string, userName: string, role: 'mechanic' | 'host'): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('add_user_to_shift', {
      shift_id: shiftId,
      user_email: userEmail,
      user_name: userName,
      shift_role: role
    });

    if (error) {
      console.error('Error signing up for shift:', error);
      throw error;
    }

    return data || false;
  }

  /**
   * Remove user from a shift
   */
  async removeFromShift(shiftId: string, userId: string, role: 'mechanic' | 'host'): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('remove_user_from_shift', {
      shift_id: shiftId,
      user_id: userId,
      shift_role: role
    });

    if (error) {
      console.error('Error removing from shift:', error);
      throw error;
    }

    return data || false;
  }

  /**
   * Toggle user's participation in a shift
   */
  async toggleShiftSignup(shift: Shift, userId: string, userEmail: string, userName: string, role: 'mechanic' | 'host'): Promise<void> {
    const signupList = role === 'mechanic' ? shift.mechanics : shift.hosts;
    const isSignedUp = signupList?.some(u => u.id === userId);

    if (isSignedUp) {
      await this.removeFromShift(shift.id, userId, role);
    } else {
      await this.signUpForShift(shift.id, userEmail, userName, role);
    }
  }
}