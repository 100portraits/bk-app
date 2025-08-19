import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface UseAuthorizationOptions {
  requireAuth?: boolean;
  requireMember?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useAuthorization({
  requireAuth = true,
  requireMember = false,
  allowedRoles = [],
  redirectTo = '/'
}: UseAuthorizationOptions = {}) {
  const { user, profile, loading, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Check authorization
    if (user && !canAccess(requireMember, allowedRoles)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, profile, loading, requireAuth, requireMember, allowedRoles, redirectTo, router, canAccess]);

  return {
    authorized: user ? canAccess(requireMember, allowedRoles) : false,
    loading
  };
}

export function useRequireMember(redirectTo = '/unauthorized') {
  return useAuthorization({
    requireAuth: true,
    requireMember: true,
    redirectTo
  });
}

export function useRequireRole(roles: UserRole[], redirectTo = '/unauthorized') {
  return useAuthorization({
    requireAuth: true,
    allowedRoles: roles,
    redirectTo
  });
}

export function useRequireAdmin(redirectTo = '/unauthorized') {
  return useAuthorization({
    requireAuth: true,
    allowedRoles: ['admin'],
    redirectTo
  });
}