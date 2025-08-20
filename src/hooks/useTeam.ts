'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { UserProfile, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export function useTeam() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchTeam = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('role', ['host', 'admin'])
          .order('created_at', { ascending: false });

        if (isCancelled) return;
        if (fetchError) throw fetchError;

        setTeamMembers(data || []);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch team'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchTeam();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const updateMemberRole = async (memberId: string, role: UserRole) => {
    // Get current member data for email
    const currentMember = teamMembers.find(m => m.id === memberId);
    const previousRole = currentMember?.role;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    
    setTeamMembers(prev => prev.map(m => m.id === memberId ? data : m));
    
    // Send role change email notification
    if (data.email) {
      try {
        await fetch('/api/email/role-change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            userName: data.name,
            newRole: role,
            previousRole: previousRole
          })
        });
      } catch (emailError) {
        console.error('Failed to send role change email:', emailError);
        // Don't throw - email failure shouldn't block the role change
      }
    }
    
    return data;
  };

  const removeMember = async (memberId: string) => {
    // Get current member data for email
    const currentMember = teamMembers.find(m => m.id === memberId);
    const previousRole = currentMember?.role;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: null })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    
    // Send role removal email notification
    if (data?.email) {
      try {
        await fetch('/api/email/role-change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            userName: data.name,
            newRole: null,
            previousRole: previousRole
          })
        });
      } catch (emailError) {
        console.error('Failed to send role removal email:', emailError);
        // Don't throw - email failure shouldn't block the role removal
      }
    }
  };

  const addMember = async (email: string, role: UserRole) => {
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) throw new Error('User not found');

    // Update their role
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userData.id)
      .select()
      .single();

    if (error) throw error;
    
    setTeamMembers(prev => [...prev, data]);
    return data;
  };

  const refresh = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['host', 'admin'])
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setTeamMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setLoading(false);
    }
  };

  return {
    teamMembers,
    loading,
    error,
    updateMemberRole,
    removeMember,
    addMember,
    refresh
  };
}