import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface UseAuthorizationOptions {
  requireAuth?: boolean;
  requireMember?: boolean;
  requireNonMember?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useAuthorization({
  requireAuth = true,
  requireMember = false,
  requireNonMember = false,
  allowedRoles = [],
  redirectTo = '/'
}: UseAuthorizationOptions = {}) {
  const { user, profile, loading, isMember, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    if (user) {
      // Check non-member requirement
      if (requireNonMember && isMember) {
        router.push('/home');
        return;
      }

      // Check authorization
      if (!canAccess(requireMember, allowedRoles)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, profile, loading, requireAuth, requireMember, requireNonMember, isMember, allowedRoles, redirectTo, router, canAccess]);

  return {
    authorized: user ? (requireNonMember ? !isMember : canAccess(requireMember, allowedRoles)) : false,
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

export function useRequireNonMember(redirectTo = '/home') {
  return useAuthorization({
    requireAuth: true,
    requireNonMember: true,
    redirectTo
  });
}