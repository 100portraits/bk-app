'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { WalkIn, CreateWalkInInput } from '@/types/walk-ins';
import { useAuth } from '@/contexts/AuthContext';

export function useWalkIns() {
  const { user } = useAuth();
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchWalkIns = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = supabase
          .from('walk_ins')
          .select(`
            *,
            creator:user_profiles (
              email,
              name
            )
          `)
          .order('created_at', { ascending: false });

        const { data, error: fetchError } = await query;

        if (isCancelled) return;
        if (fetchError) throw fetchError;

        setWalkIns(data || []);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch walk-ins'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchWalkIns();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const createWalkIn = async (walkIn: CreateWalkInInput) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('walk_ins')
      .insert({
        ...walkIn,
        created_by: user.id
      })
      .select(`
        *,
        creator:user_profiles (
          email,
          name
        )
      `)
      .single();

    if (error) throw error;
    
    setWalkIns(prev => [data, ...prev]);
    return data;
  };

  const updateWalkIn = async (id: string, updates: Partial<WalkIn>) => {
    const { data, error } = await supabase
      .from('walk_ins')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        creator:user_profiles (
          email,
          name
        )
      `)
      .single();

    if (error) throw error;
    
    setWalkIns(prev => prev.map(w => w.id === id ? data : w));
    return data;
  };

  const deleteWalkIn = async (id: string) => {
    const { error } = await supabase
      .from('walk_ins')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    setWalkIns(prev => prev.filter(w => w.id !== id));
  };

  // Note: status tracking is not available in the current schema
  // These functions are kept for potential future use
  const startService = async (id: string) => {
    // Status field doesn't exist in walk_ins table
    // Could potentially use notes field to track status
    return updateWalkIn(id, {
      notes: 'Service in progress'
    });
  };

  const completeService = async (id: string) => {
    // Status field doesn't exist in walk_ins table
    // Could potentially use notes field to track status
    return updateWalkIn(id, {
      notes: 'Service completed'
    });
  };

  const getWalkInsByDate = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    try {
      const { data, error } = await supabase
        .from('walk_ins')
        .select(`
          *,
          creator:user_profiles (
            email
          )
        `)
        .eq('date', dateStr)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch walk-ins'));
      throw err;
    }
  };

  const getWalkInStats = async (startDate: Date, endDate: Date) => {
    // For single day stats, just use the date
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    try {
      let query = supabase
        .from('walk_ins')
        .select('is_community_member, amount_paid');
      
      if (isSameDay) {
        // For single day, use the date column
        const dateStr = startDate.toISOString().split('T')[0];
        query = query.eq('date', dateStr);
      } else {
        // For date range, use date column with range
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        query = query.gte('date', startStr).lte('date', endStr);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      throw err;
    }
  };

  const refresh = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const query = supabase
        .from('walk_ins')
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


      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      
      setWalkIns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setLoading(false);
    }
  };

  return {
    walkIns,
    loading,
    error,
    createWalkIn,
    updateWalkIn,
    deleteWalkIn,
    startService,
    completeService,
    getWalkInsByDate,
    getWalkInStats,
    refresh
  };
}