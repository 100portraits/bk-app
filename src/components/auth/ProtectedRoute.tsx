'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMember?: boolean;
  requireNonMember?: boolean;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireMember = false,
  requireNonMember = false,
  allowedRoles = [],
  fallback = <div>Loading...</div>,
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) {
  const { user, loading, isMember, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (requireNonMember && isMember) {
        router.push('/home');
      } else if (!requireNonMember && !canAccess(requireMember, allowedRoles)) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, requireMember, requireNonMember, isMember, allowedRoles, redirectTo, router, canAccess]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  if (requireNonMember && isMember) {
    return <>{fallback}</>;
  }

  if (!requireNonMember && !canAccess(requireMember, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}