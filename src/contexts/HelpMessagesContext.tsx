'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';
import { HelpMessage } from '@/types/help-messages';
import { useAuth } from '@/contexts/AuthContext';

interface HelpMessagesContextType {
  messages: HelpMessage[];
  loading: boolean;
  error: Error | null;
  createMessage: (message: {
    category?: string;
    message: string;
    context_page?: string;
  }) => Promise<HelpMessage>;
  updateMessage: (id: string, updates: Partial<HelpMessage>) => Promise<HelpMessage>;
  respondToMessage: (id: string, response: string) => Promise<HelpMessage>;
  markAsRead: (id: string) => Promise<HelpMessage>;
  deleteMessage: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const HelpMessagesContext = createContext<HelpMessagesContextType | undefined>(undefined);

export function HelpMessagesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

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
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const createMessage = async (message: {
    category?: string;
    message: string;
    context_page?: string;
  }) => {
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
    const message = messages.find(m => m.id === id);
    
    const updatedMessage = await updateMessage(id, {
      response,
      responded_at: new Date().toISOString()
    });
    
    if (message) {
      try {
        let userEmail = null;
        if (message.user_id) {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('id', message.user_id)
            .single();
          userEmail = userProfile?.email;
        }
        
        if (userEmail) {
          await fetch('/api/email/admin-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              userName: message.user_name,
              originalMessage: message.message,
              adminResponse: response,
              messagePage: message.page_name
            })
          });
        }
      } catch (error) {
        console.error('Failed to send response email:', error);
      }
    }
    
    return updatedMessage;
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
      if (error.code === '42501' || error.message?.includes('policy')) {
        throw new Error('You do not have permission to delete this message. Please ensure you have admin privileges.');
      }
      throw error;
    }
    
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const refresh = async () => {
    await fetchMessages();
  };

  return (
    <HelpMessagesContext.Provider value={{
      messages,
      loading,
      error,
      createMessage,
      updateMessage,
      respondToMessage,
      markAsRead,
      deleteMessage,
      refresh
    }}>
      {children}
    </HelpMessagesContext.Provider>
  );
}

export function useHelpMessagesContext() {
  const context = useContext(HelpMessagesContext);
  if (!context) {
    throw new Error('useHelpMessagesContext must be used within HelpMessagesProvider');
  }
  return context;
}