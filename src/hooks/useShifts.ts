'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { Shift, DayOfWeek } from '@/types/shifts';
import { useAuth } from '@/contexts/AuthContext';

export function useShifts() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchShifts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('shifts')
          .select('*')
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (isCancelled) return;

        if (fetchError) throw fetchError;

        setShifts(data || []);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch shifts'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchShifts();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const createShift = async (shift: Omit<Shift, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('shifts')
      .insert(shift)
      .select()
      .single();

    if (error) throw error;
    
    setShifts(prev => [...prev, data].sort((a, b) => 
      a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)
    ));
    
    return data;
  };

  const updateShift = async (id: string, updates: Partial<Shift>) => {
    const { data, error } = await supabase
      .from('shifts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setShifts(prev => prev.map(s => s.id === id ? data : s));
    return data;
  };

  const deleteShift = async (id: string) => {
    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const getShifts = async (startDate: Date, endDate: Date) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;
      
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch shifts'));
      throw err;
    }
  };

  const signUpForShift = async (shiftId: string, userEmail: string, userName: string, role: 'mechanic' | 'host') => {
    const { data, error } = await supabase.rpc('add_user_to_shift', {
      shift_id: shiftId,
      user_email: userEmail,
      user_name: userName,
      shift_role: role
    });

    if (error) throw error;
    return data || false;
  };

  const removeFromShift = async (shiftId: string, userId: string, role: 'mechanic' | 'host') => {
    const { data, error } = await supabase.rpc('remove_user_from_shift', {
      shift_id: shiftId,
      user_id: userId,
      shift_role: role
    });

    if (error) throw error;
    return data || false;
  };

  const toggleShiftSignup = async (shift: Shift, userId: string, userEmail: string, userName: string, role: 'mechanic' | 'host') => {
    const signupList = role === 'mechanic' ? shift.mechanics : shift.hosts;
    const isSignedUp = signupList?.some(u => u.id === userId);

    if (isSignedUp) {
      await removeFromShift(shift.id, userId, role);
    } else {
      await signUpForShift(shift.id, userEmail, userName, role);
    }
  };

  const toggleShift = async (date: Date, dayOfWeek: DayOfWeek, startTime: string) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if shift already exists
    const existingShift = shifts.find(s => s.date === dateStr && s.day_of_week === dayOfWeek);
    
    if (existingShift) {
      // Toggle is_open status
      await updateShift(existingShift.id, { is_open: !existingShift.is_open });
    } else {
      // Calculate end time (4 hours after start time)
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHours = hours + 4;
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Create new shift
      await createShift({
        date: dateStr,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_open: true
      });
    }
  };

  const refresh = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('shifts')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;
      
      setShifts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setLoading(false);
    }
  };

  return {
    shifts,
    loading,
    error,
    createShift,
    updateShift,
    deleteShift,
    getShifts,
    signUpForShift,
    removeFromShift,
    toggleShiftSignup,
    toggleShift,
    refresh
  };
}