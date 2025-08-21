'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function MemberWelcomePage() {
  const router = useRouter();
  const { profile } = useAuth();

  useEffect(() => {
    // If not a member, redirect to home
    if (profile && !profile.member) {
      router.push('/home');
    }
  }, [profile, router]);

  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <AppLayout title="Welcome Member">
      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Welcome to the community!
          </h1>
          
          <div className="p-4 bg-accent-50 dark:bg-accent-950 rounded-lg border border-accent-200 dark:border-accent-700">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Account</p>
              <p className="font-medium text-zinc-900 dark:text-white">{profile?.email || 'Loading...'}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-xs rounded-full font-medium">
                Active Membership
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Your member benefits:</h2>
          
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Come by anytime for free</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                Visit during any open hours without payment
              </p>
              <SecondaryButton
                onClick={() => router.push('/booking')}
                fullWidth
              >
                Make an appointment
              </SecondaryButton>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">Join community events</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">
                Workshops, borrels, and member-only activities
              </p>
              <SecondaryButton
                onClick={() => router.push('/membership/events')}
                fullWidth
              >
                View event calendar
              </SecondaryButton>
            </div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-4">
            You can find these options in the main menu now.
          </p>
        </section>

        <PrimaryButton
          onClick={handleGetStarted}
          fullWidth
        >
          Continue to app
        </PrimaryButton>
      </div>
    </AppLayout>
  );
}