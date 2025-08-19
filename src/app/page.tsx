'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import TextInput from '@/components/ui/TextInput';
import { IconUser, IconPlus } from '@tabler/icons-react';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  const handleBookAppointment = () => {
    router.push('/booking/new');
  };

  const handleLogin = () => {
    setShowLogin(false);
    router.push('/home');
  };

  const handleRegister = () => {
    setShowRegister(false);
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-end p-4">
        <SecondaryButton
          onClick={() => setShowLogin(true)}
          icon={<IconUser size={20} />}
          className="bg-purple-100 text-purple-700 border-purple-200"
        >
          Log in
        </SecondaryButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bike Kitchen UvA
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Your innovative, circular bike workshop at the Roeterseilandcampus.
          </p>
        </div>

        <PrimaryButton
          onClick={handleBookAppointment}
          icon={<IconPlus size={20} />}
          size="lg"
        >
          Book an appointment
        </PrimaryButton>
      </div>

      <BottomSheetDialog
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bike Kitchen UvA
            </h2>
            <p className="text-gray-600">
              Your innovative, circular bike workshop at the Roeterseilandcampus.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <TextInput
                type="email"
                placeholder="Value"
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <TextInput
                type="password"
                placeholder="Value"
                fullWidth
              />
            </div>

            <PrimaryButton
              onClick={handleLogin}
              fullWidth
              className="bg-gray-900 hover:bg-gray-800"
            >
              Sign In
            </PrimaryButton>

            <div className="text-center">
              <button className="text-sm text-gray-600 underline">
                Forgot password?
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Or </span>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
                className="text-purple-600 underline"
              >
                make an account
              </button>
            </div>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bike Kitchen UvA
            </h2>
            <p className="text-gray-600">
              Your innovative, circular bike workshop at the Roeterseilandcampus.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <TextInput
                type="email"
                placeholder="Value"
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <TextInput
                type="password"
                placeholder="Value"
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat Password
              </label>
              <TextInput
                type="password"
                placeholder="Value"
                fullWidth
              />
            </div>

            <PrimaryButton
              onClick={handleRegister}
              fullWidth
              className="bg-gray-900 hover:bg-gray-800"
            >
              Sign Up
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </div>
  );
}
