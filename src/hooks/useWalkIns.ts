'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { WalkIn, CreateWalkInInput } from '@/types/walk-ins';
import { useAuth } from '@/contexts/AuthContext';

export function useWalkIns(shiftId?: string) {
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
        let query = supabase
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
          .order('arrival_time', { ascending: false });

        if (shiftId) {
          query = query.eq('shift_id', shiftId);
        }

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
  }, [user?.id, shiftId]);

  const createWalkIn = async (walkIn: CreateWalkInInput) => {
    const { data, error } = await supabase
      .from('walk_ins')
      .insert(walkIn)
      .select(`
        *,
        shift:shifts (
          date,
          day_of_week,
          start_time,
          end_time
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
        shift:shifts (
          date,
          day_of_week,
          start_time,
          end_time
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
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    try {
      const { data, error } = await supabase
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
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch walk-ins'));
      throw err;
    }
  };

  const getWalkInStats = async (startDate: Date, endDate: Date) => {
    try {
      const { data, error } = await supabase
        .from('walk_ins')
        .select('is_community_member, amount_paid')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
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
      let query = supabase
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
        .order('arrival_time', { ascending: false });

      if (shiftId) {
        query = query.eq('shift_id', shiftId);
      }

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