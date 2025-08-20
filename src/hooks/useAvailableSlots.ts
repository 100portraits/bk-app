'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { Booking, TimeSlot, AvailableSlot, CreateBookingInput } from '@/types/bookings';
import { Shift } from '@/types/shifts';
import { format, parse, addMinutes, isAfter, isBefore, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export function useAvailableSlots() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateTimeSlots = (
    shift: Shift, 
    durationMinutes: number,
    existingBookings: Booking[]
  ): TimeSlot[] => {
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
  };

  const getAvailableSlots = useCallback(async (
    date: Date,
    durationMinutes: number
  ): Promise<AvailableSlot[]> => {
    setLoading(true);
    setError(null);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Get all open shifts for the date
      const { data: shifts, error: shiftsError } = await supabase
        .from('shifts')
        .select('*')
        .eq('date', dateStr)
        .eq('is_open', true)
        .order('start_time');
      
      if (shiftsError) throw shiftsError;
      
      if (!shifts || shifts.length === 0) {
        return [];
      }
      
      // Get all bookings for these shifts
      const shiftIds = shifts.map(s => s.id);
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('shift_id', shiftIds)
        .neq('status', 'cancelled');
      
      if (bookingsError) throw bookingsError;
      
      // Generate available slots for each shift
      const availableSlots: AvailableSlot[] = shifts.map(shift => {
        const shiftBookings = bookings?.filter(b => b.shift_id === shift.id) || [];
        
        return {
          shift_id: shift.id,
          date: shift.date,
          day_of_week: shift.day_of_week,
          slots: generateTimeSlots(shift, durationMinutes, shiftBookings)
        };
      });
      
      return availableSlots;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch available slots');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableDates = useCallback(async (weeksAhead: number = 4): Promise<Date[]> => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (weeksAhead * 7));
      
      const { data: shifts, error } = await supabase
        .from('shifts')
        .select('date')
        .eq('is_open', true)
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date');
      
      if (error) throw error;
      
      // Convert to unique dates
      const uniqueDates = [...new Set(shifts?.map(s => s.date) || [])];
      return uniqueDates.map(dateStr => parseISO(dateStr));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch available dates');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (input: CreateBookingInput): Promise<Booking> => {
    // Email is required for all bookings
    if (!input.email) {
      throw new Error('Email is required to create booking');
    }

    setLoading(true);
    setError(null);

    try {
      let userId = null;
      
      // If user is logged in, get their profile
      if (user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (!userProfile) {
          throw new Error('User profile not found');
        }
        userId = userProfile.id;
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId, // null for guest bookings
          email: input.email, // always save the email
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
      
      if (error) throw error;
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create booking');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    getAvailableSlots,
    getAvailableDates,
    createBooking
  };
}