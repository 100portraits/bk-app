'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';

function GoodbyeContent() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/home');
  };

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
  return <GoodbyeContent />;
}