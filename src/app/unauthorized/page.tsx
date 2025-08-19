'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconHome, IconLock } from '@tabler/icons-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, isMember, role } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <IconLock size={40} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          {!user ? (
            "You need to be logged in to access this page."
          ) : !isMember ? (
            "This page is only accessible to members. Please contact an admin to upgrade your account."
          ) : (
            "You don't have the required permissions to access this page."
          )}
        </p>

        {user && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">Your current status:</p>
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