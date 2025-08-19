'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Avatar from '@/components/ui/Avatar';
import { IconExternalLink } from '@tabler/icons-react';

export default function BecomeMemberPage() {
  const router = useRouter();

  const handleJoinCommunity = () => {
    window.open('https://doneren.auf.nl/bike-kitchen', '_blank');
  };

  const handleAlreadyMember = () => {
    router.push('/become-member/name');
  };

  return (
    <AppLayout title="Become a Member">
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Great that you want to join!
          </h1>
          
          <div className="text-left space-y-4">
            <p className="text-xl font-medium text-gray-900">
              For €4/month, you get:
            </p>
            
            <ul className="space-y-2 text-gray-700">
              <li>• unlimited access to the BK space</li>
              <li>• join monthly workshops</li>
              <li>• join monthly community borrels</li>
              <li>• be part of a repair-enthusiast community</li>
              <li>• support our goal - we are run on donations</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">How to join:</h2>
          <ol className="space-y-2 text-gray-700">
            <li>1. go to the AUF page below</li>
            <li>2. choose 'I donate → monthly' → €4 (or more)</li>
            <li>3. fill in your details</li>
            <li>4. Done! Return to this page and select 'I became a member already'</li>
          </ol>
        </section>

        <section className="space-y-4">
          <PrimaryButton
            onClick={handleJoinCommunity}
            fullWidth
            icon={<Avatar variant="secondary" size="sm" />}
          >
            Join the community
          </PrimaryButton>
          
          <PrimaryButton
            onClick={handleAlreadyMember}
            fullWidth
            icon={<Avatar variant="secondary" size="sm" />}
          >
            I became a member already!
          </PrimaryButton>
        </section>
      </div>
    </AppLayout>
  );
}