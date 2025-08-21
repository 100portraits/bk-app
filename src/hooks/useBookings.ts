'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { Booking } from '@/types/bookings';
import { useAuth } from '@/contexts/AuthContext';
import { BookingsAPI } from '@/lib/bookings/api';
import { withConnectionRetry } from '@/hooks/useSupabaseConnection';

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const api = new BookingsAPI();

  useEffect(() => {
    if (!user) {
      console.log('[useBookings] No user, skipping fetch');
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchBookings = async () => {
      console.log('[useBookings] Fetching bookings for user:', user.email);
      setLoading(true);
      setError(null);

      try {
        const result = await withConnectionRetry(async () => {
          const { data, error: fetchError } = await supabase
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
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchError) {
            console.error('[useBookings] Error:', fetchError);
            throw fetchError;
          }

          return data;
        });

        if (isCancelled) {
          console.log('[useBookings] Request was cancelled');
          return;
        }

        console.log('[useBookings] Fetched bookings:', result?.length || 0);
        setBookings(result || []);
      } catch (err) {
        if (!isCancelled) {
          console.error('[useBookings] Error fetching bookings:', err);
          setError(err instanceof Error ? err : new Error('Failed to fetch bookings'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    // Cleanup function
    return () => {
      isCancelled = true;
      console.log('[useBookings] Cleanup - cancelling any pending requests');
    };
  }, [user?.id]); // Only re-fetch if user ID changes (not the object reference)

  const cancelBooking = async (bookingId: string, cancelledBy: 'user' | 'admin' = 'user', reason?: string) => {
    console.log('[useBookings] Cancelling booking:', bookingId, 'by:', cancelledBy);
    
    try {
      await api.cancelBooking(bookingId, cancelledBy, reason);
      
      // Update local state
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)
      );
    } catch (error) {
      console.error('[useBookings] Error cancelling booking:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'no_show' | 'cancelled') => {
    console.log('[useBookings] Updating booking status:', bookingId, status);
    
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      console.error('[useBookings] Error updating booking status:', error);
      throw error;
    }

    // Update local state
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status } : b)
    );
  };

  const getShiftBookings = async (shiftId: string) => {
    console.log('[useBookings] Fetching shift bookings:', shiftId);
    
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('[useBookings] Error fetching shift bookings:', err);
      throw err;
    }
  };

  const refresh = async () => {
    if (!user) return;
    
    console.log('[useBookings] Refreshing bookings');
    setLoading(true);
    
    try {
      const { data, error: fetchError } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setBookings(data || []);
    } catch (err) {
      console.error('[useBookings] Error refreshing:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    cancelBooking,
    updateBookingStatus,
    getShiftBookings,
    refresh
  };
}