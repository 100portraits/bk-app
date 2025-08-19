'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMember?: boolean;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireMember = false,
  allowedRoles = [],
  fallback = <div>Loading...</div>,
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) {
  const { user, loading, canAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (!canAccess(requireMember, allowedRoles)) {
        router.push(redirectTo);
      }
    }
  }, [user, loading, requireMember, allowedRoles, redirectTo, router, canAccess]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (!user || !canAccess(requireMember, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}