import { createClient } from '@/lib/supabase/client';
import { Booking, CreateBookingInput, TimeSlot, AvailableSlot } from '@/types/bookings';
import { Shift } from '@/types/shifts';
import { format, parse, addMinutes, isAfter, isBefore, parseISO } from 'date-fns';

export class BookingsAPI {
  private supabase = createClient();

  /**
   * Generate time slots for a shift
   * @param shift The shift to generate slots for
   * @param durationMinutes The duration of the repair in minutes
   * @returns Array of time slots with availability
   */
  private generateTimeSlots(
    shift: Shift, 
    durationMinutes: number,
    existingBookings: Booking[]
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    // Parse shift times
    const shiftStart = parse(shift.start_time, 'HH:mm:ss', new Date());
    const shiftEnd = parse(shift.end_time, 'HH:mm:ss', new Date());
    
    // Generate slots every 30 minutes
    let currentSlot = shiftStart;
    
    while (isBefore(currentSlot, shiftEnd)) {
      const slotTimeStr = format(currentSlot, 'HH:mm');
      const slotEndTime = addMinutes(currentSlot, durationMinutes);
      
      // Check if this is the last possible slot
      const nextSlotStart = addMinutes(currentSlot, 30);
      const isLastSlot = !isBefore(nextSlotStart, shiftEnd);
      
      // Determine availability
      let available = true;
      let reason: TimeSlot['reason'] = undefined;
      
      // Check if slot is already booked
      const isBooked = existingBookings.some(
        booking => booking.slot_time.substring(0, 5) === slotTimeStr
      );
      
      if (isBooked) {
        available = false;
        reason = 'booked';
      }
      // Check if repair would exceed shift end time
      else if (isAfter(slotEndTime, shiftEnd)) {
        available = false;
        reason = 'insufficient_time';
      }
      // Special rule: last slot can only accept 30-minute repairs
      else if (isLastSlot && durationMinutes > 30) {
        available = false;
        reason = 'insufficient_time';
      }
      
      slots.push({
        time: slotTimeStr,
        available,
        reason
      });
      
      // Move to next 30-minute slot
      currentSlot = addMinutes(currentSlot, 30);
    }
    
    return slots;
  }

  /**
   * Get available slots for a specific date and repair duration
   */
  async getAvailableSlots(
    date: Date,
    durationMinutes: number
  ): Promise<AvailableSlot[]> {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Get all open shifts for the date
    const { data: shifts, error: shiftsError } = await this.supabase
      .from('shifts')
      .select('*')
      .eq('date', dateStr)
      .eq('is_open', true)
      .order('start_time');
    
    if (shiftsError) {
      console.error('Error fetching shifts:', shiftsError);
      throw shiftsError;
    }
    
    if (!shifts || shifts.length === 0) {
      return [];
    }
    
    // Get all bookings for these shifts
    const shiftIds = shifts.map(s => s.id);
    const { data: bookings, error: bookingsError } = await this.supabase
      .from('bookings')
      .select('*')
      .in('shift_id', shiftIds)
      .neq('status', 'cancelled');
    
    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      throw bookingsError;
    }
    
    // Generate available slots for each shift
    const availableSlots: AvailableSlot[] = shifts.map(shift => {
      const shiftBookings = bookings?.filter(b => b.shift_id === shift.id) || [];
      
      return {
        shift_id: shift.id,
        date: shift.date,
        day_of_week: shift.day_of_week,
        slots: this.generateTimeSlots(shift, durationMinutes, shiftBookings)
      };
    });
    
    return availableSlots;
  }

  /**
   * Get dates with available shifts for the next N weeks
   */
  async getAvailableDates(weeksAhead: number = 4): Promise<Date[]> {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (weeksAhead * 7));
    
    const { data: shifts, error } = await this.supabase
      .from('shifts')
      .select('date')
      .eq('is_open', true)
      .gte('date', format(today, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date');
    
    if (error) {
      console.error('Error fetching available dates:', error);
      throw error;
    }
    
    // Convert to unique dates
    const uniqueDates = [...new Set(shifts?.map(s => s.date) || [])];
    return uniqueDates.map(dateStr => parseISO(dateStr));
  }

  /**
   * Create a new booking
   */
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const { data: userProfile } = await this.supabase
      .from('user_profiles')
      .select('id')
      .single();
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    const { data, error } = await this.supabase
      .from('bookings')
      .insert({
        user_id: userProfile.id,
        shift_id: input.shift_id,
        slot_time: `${input.slot_time}:00`, // Convert HH:MM to HH:MM:SS
        duration_minutes: input.duration_minutes,
        repair_type: input.repair_type,
        repair_details: input.repair_details,
        notes: input.notes,
        status: 'confirmed',
        is_member: input.is_member || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    
    return data;
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId?: string): Promise<Booking[]> {
    let query = this.supabase
      .from('bookings')
      .select(`
        *,
        shift:shifts (
          date,
          day_of_week,
          start_time,
          end_time
        )
      `)
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
    
    return data || [];
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await this.supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);
    
    if (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Update booking status (admin only)
   */
  async updateBookingStatus(
    bookingId: string, 
    status: Booking['status']
  ): Promise<void> {
    const { error } = await this.supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    
    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Get bookings for a specific shift (staff view)
   */
  async getShiftBookings(shiftId: string): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        user:user_profiles (
          email,
          member
        )
      `)
      .eq('shift_id', shiftId)
      .neq('status', 'cancelled')
      .order('slot_time');
    
    if (error) {
      console.error('Error fetching shift bookings:', error);
      throw error;
    }
    
    return data || [];
  }
}