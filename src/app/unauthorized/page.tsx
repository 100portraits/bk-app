'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconHome, IconLock } from '@tabler/icons-react';
import { Suspense } from 'react';

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isMember, role } = useAuth();
  const attemptedPath = searchParams.get('from') || '';

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <IconLock size={40} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-zinc-600 mb-8">
          {!user ? (
            "You need to be logged in to access this page."
          ) : attemptedPath.includes('become-member') && isMember ? (
            "The 'Become a Member' section is only for non-members. You're already a member!"
          ) : attemptedPath.includes('membership') && !isMember ? (
            "This page is only accessible to members. Check out the 'Become a Member' section!"
          ) : attemptedPath.includes('admin') ? (
            "Admin access required. You need admin privileges to view this page."
          ) : attemptedPath.includes('host') ? (
            "This page requires host, mechanic, or admin privileges."
          ) : !isMember ? (
            "This page is only accessible to members. Please contact an admin to upgrade your account."
          ) : (
            "You don't have the required permissions to access this page."
          )}
        </p>

        {user && (
          <div className="bg-zinc-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-zinc-600">Your current status:</p>
            <ul className="mt-2 space-y-1">
              <li className="text-sm">
                <span className="font-medium">Member:</span> {isMember ? 'Yes' : 'No'}
              </li>
              <li className="text-sm">
                <span className="font-medium">Role:</span> {role || 'None'}
              </li>
            </ul>
          </div>
        )}

        <div className="space-y-3">
          <PrimaryButton
            onClick={() => router.push('/home')}
            icon={<IconHome size={20} />}
            fullWidth
          >
            Go to Home
          </PrimaryButton>
          
          {!user && (
            <SecondaryButton
              onClick={() => router.push('/')}
              fullWidth
            >
              Log In
            </SecondaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <IconLock size={40} className="text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}