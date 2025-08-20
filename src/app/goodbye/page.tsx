'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useMembership } from '@/hooks/useMembership';
import { useAuth } from '@/contexts/AuthContext';
import { IconLoader2 } from '@tabler/icons-react';

function GoodbyeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { cancelMembership } = useMembership();

  useEffect(() => {
    const shouldCancel = searchParams.get('cancel') === 'true';
    if (shouldCancel && !isProcessing && !isComplete) {
      handleCancelMembership();
    }
  }, [searchParams]);

  const handleCancelMembership = async () => {
    setIsProcessing(true);
    try {
      await cancelMembership();
      setIsComplete(true);
    } catch (error) {
      console.error('Error cancelling membership:', error);
      alert('Failed to cancel membership. Please try again.');
      router.push('/membership');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  if (isProcessing) {
    return (
      <AppLayout title="Membership">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <IconLoader2 className="animate-spin mb-4" size={32} />
          <p className="text-gray-600">Cancelling membership...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Membership">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Sorry to see you go
          </h1>
          <p className="text-gray-600">
            Your membership has been cancelled
          </p>
        </div>

        <PrimaryButton
          onClick={handleGoHome}
          className="min-w-[200px]"
        >
          Back to home
        </PrimaryButton>
      </div>
    </AppLayout>
  );
}

export default function GoodbyePage() {
  return (
    <Suspense fallback={
      <AppLayout title="Membership">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <IconLoader2 className="animate-spin mb-4" size={32} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </AppLayout>
    }>
      <GoodbyeContent />
    </Suspense>
  );
}