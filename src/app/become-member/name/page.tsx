'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextInput from '@/components/ui/TextInput';

export default function MemberNamePage() {
  const [name, setName] = useState('Sahir');
  const router = useRouter();

  const handleContinue = () => {
    router.push('/become-member/details');
  };

  return (
    <AppLayout title="Become a Member">
      <div className="space-y-8">
        <section className=" space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, member!
          </h1>
          <h2 className="text-xl text-gray-700">
            What's your name?
          </h2>
        </section>

        <section className="space-y-4">
          <TextInput
            value={name}
            onChange={setName}
            fullWidth
            className="text-purple-600 border-purple-200 font-medium"
          />
          
          <div className="text-sm text-gray-600 italic">
            *I can't pull data from AUF for privacy reasons. Therefore, this runs on the honour system. 
            I trust that you did pay for your membership.
          </div>
        </section>

        <PrimaryButton
          onClick={handleContinue}
          fullWidth
          disabled={!name.trim()}
        >
          Onwards!
        </PrimaryButton>
      </div>
    </AppLayout>
  );
}