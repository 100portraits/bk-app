'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/singleton-client';

export function useSupabaseConnection() {
  const retryTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const isConnectedRef = useRef(true);

  useEffect(() => {
    let mounted = true;

    // Function to check and restore connection
    const checkConnection = async () => {
      if (!mounted) return;
      
      try {
        // Simple health check query
        const { error } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1)
          .single();
        
        if (error && error.code === 'PGRST301') {
          // This error is expected if no rows exist, connection is fine
          isConnectedRef.current = true;
        } else if (error) {
          console.log('[Connection] Database connection issue detected:', error.message);
          isConnectedRef.current = false;
          
          // Try to refresh the session
          const { error: sessionError } = await supabase.auth.getSession();
          if (!sessionError) {
            console.log('[Connection] Session refreshed successfully');
            isConnectedRef.current = true;
          }
        } else {
          isConnectedRef.current = true;
        }
      } catch (err) {
        console.error('[Connection] Connection check failed:', err);
        isConnectedRef.current = false;
      }
    };

    // Check connection on mount
    checkConnection();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Connection] Tab became visible, checking database connection');
        
        // Clear any pending retry
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        
        // Check connection immediately
        checkConnection();
      }
    };

    // Handle online/offline events
    const handleOnline = () => {
      console.log('[Connection] Network connection restored');
      checkConnection();
    };

    const handleOffline = () => {
      console.log('[Connection] Network connection lost');
      isConnectedRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', checkConnection);

    return () => {
      mounted = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', checkConnection);
    };
  }, []);

  return { isConnected: isConnectedRef.current };
}

// Wrapper for database operations with automatic retry
export async function withConnectionRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  retryDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // If not first attempt, refresh session first
      if (i > 0) {
        console.log(`[Connection] Retry attempt ${i + 1}/${maxRetries}`);
        await supabase.auth.getSession();
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection-related error
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.message?.includes('fetch')) {
        console.log('[Connection] Network error detected, will retry');
        continue;
      }
      
      // If it's not a connection error, throw immediately
      throw error;
    }
  }
  
  console.error('[Connection] Max retries exceeded');
  throw lastError;
}