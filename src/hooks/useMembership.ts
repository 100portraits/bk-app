'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { useAuth } from '@/contexts/AuthContext';

export function useMembership() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const becomeMember = useCallback(async (additionalInfo?: {
    student_number?: string;
    phone?: string;
  }) => {
    if (!user) throw new Error('Must be logged in');

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          member: true,
          ...additionalInfo
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the profile to get updated membership status
      await refreshProfile();
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update membership');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile]);

  const cancelMembership = useCallback(async () => {
    if (!user) throw new Error('Must be logged in');

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          member: false
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the profile
      await refreshProfile();
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel membership');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile]);

  const checkMembershipStatus = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('member')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        isMember: data.member
      };
    } catch (err) {
      console.error('Error checking membership:', err);
      return null;
    }
  }, [user]);

  return {
    isMember: profile?.member || false,
    loading,
    error,
    becomeMember,
    cancelMembership,
    checkMembershipStatus
  };
}