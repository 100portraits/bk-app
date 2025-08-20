'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { HelpMessage } from '@/types/help-messages';
import { useAuth } from '@/contexts/AuthContext';

export function useHelpMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('help_messages')
          .select('*')
          .order('created_at', { ascending: false });

        // If user is logged in, fetch their messages
        if (user) {
          query = query.or(`user_id.eq.${user.id},user_id.is.null`);
        } else {
          query = query.is('user_id', null);
        }

        const { data, error: fetchError } = await query;

        if (isCancelled) return;
        if (fetchError) throw fetchError;

        setMessages(data || []);
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const createMessage = async (message: {
    category?: string;
    message: string;
    context_page?: string;
  }) => {
    // Get user's name from profile if logged in
    let userName = null;
    if (user?.id) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      userName = profile?.name;
    }

    const { data, error } = await supabase
      .from('help_messages')
      .insert({
        page_name: message.context_page || 'Unknown',
        message: message.message,
        user_id: user?.id,
        user_name: userName
      })
      .select()
      .single();

    if (error) throw error;
    
    setMessages(prev => [data, ...prev]);
    return data;
  };

  const updateMessage = async (id: string, updates: Partial<HelpMessage>) => {
    const { data, error } = await supabase
      .from('help_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setMessages(prev => prev.map(m => m.id === id ? data : m));
    return data;
  };

  const respondToMessage = async (id: string, response: string) => {
    return updateMessage(id, {
      response,
      responded_at: new Date().toISOString()
    });
  };
  
  const markAsRead = async (id: string) => {
    return updateMessage(id, {
      read_at: new Date().toISOString()
    });
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase
      .from('help_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      // Check if it's a permission error
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error('You do not have permission to delete this message. Please ensure you have admin privileges.');
      }
      throw error;
    }
    
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const refresh = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('help_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    createMessage,
    updateMessage,
    respondToMessage,
    markAsRead,
    deleteMessage,
    refresh
  };
}