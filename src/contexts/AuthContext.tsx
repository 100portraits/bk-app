'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/singleton-client';
import { UserProfile, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isMember: boolean;
  role: UserRole;
  hasRole: (roles: UserRole[]) => boolean;
  canAccess: (requireMember?: boolean, allowedRoles?: UserRole[], requireNonMember?: boolean) => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isMember: false,
  role: null,
  hasRole: () => false,
  canAccess: () => false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let mounted = true;
    let profileFetchTimeout: NodeJS.Timeout;
    let currentUserId: string | null = null;

    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);
          currentUserId = sessionUser?.id ?? null;
          
          if (sessionUser) {
            const profileData = await fetchProfile(sessionUser.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Auth state changed:', event, session?.user?.email);
      
      // Skip INITIAL_SESSION as we already handled it in getUser()
      if (event === 'INITIAL_SESSION') {
        return;
      }
      
      const newUser = session?.user ?? null;
      const newUserId = newUser?.id ?? null;
      
      if (mounted) {
        // Handle TOKEN_REFRESHED - only skip if user hasn't changed
        if (event === 'TOKEN_REFRESHED' && newUserId === currentUserId) {
          console.log('[Auth] Token refreshed for same user, skipping');
          return;
        }
        
        // Handle SIGNED_IN, SIGNED_OUT, or user change
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || newUserId !== currentUserId) {
          console.log('[Auth] User changed:', currentUserId, '->', newUserId);
          setUser(newUser);
          currentUserId = newUserId;
          
          // Clear any pending profile fetch
          clearTimeout(profileFetchTimeout);
          
          if (newUser) {
            // Fetch profile for new user
            profileFetchTimeout = setTimeout(async () => {
              const profileData = await fetchProfile(newUser.id);
              if (mounted) {
                setProfile(profileData);
              }
            }, 100);
          } else {
            setProfile(null);
          }
        }
        
        setLoading(false);
      }
    });

    // Handle tab visibility changes to refresh session
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUserId) {
        console.log('[Auth] Tab became visible, checking session');
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (error) {
            console.error('[Auth] Error refreshing session on tab focus:', error);
          } else if (session) {
            console.log('[Auth] Session refreshed on tab focus');
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle focus event as a backup
    const handleFocus = () => {
      if (currentUserId) {
        console.log('[Auth] Window focused, checking session');
        supabase.auth.getSession();
      }
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      mounted = false;
      clearTimeout(profileFetchTimeout);
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!profile) return false;
    return roles.includes(profile.role);
  };

  const canAccess = (requireMember = false, allowedRoles: UserRole[] = [], requireNonMember = false) => {
    if (!profile) return false;
    
    // Check non-member requirement
    if (requireNonMember && profile.member) return false;
    
    // Check membership requirement
    if (requireMember && !profile.member) return false;
    
    // If no specific roles required, membership check is enough
    if (allowedRoles.length === 0) return true;
    
    // Check if user has one of the allowed roles
    return hasRole(allowedRoles);
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isMember: profile?.member ?? false,
    role: profile?.role ?? null,
    hasRole,
    canAccess,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}