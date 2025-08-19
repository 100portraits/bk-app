'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function MemberDetailsPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <AppLayout title="Become a Member">
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, <span className="text-purple-600">Sahir</span>!
          </h1>
          <p className="text-gray-700">
            You will have a few new options in the BK-app now.
          </p>
        </section>

        <section className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">1. Member Info Access</h3>
              <p className="text-gray-600 text-sm">Check out the Member Info tab</p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">2. Enhanced Booking</h3>
              <p className="text-gray-600 text-sm">
                New pages for managing your bookings and seeing previous bookings
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">3. Community Involvement</h3>
              <p className="text-gray-600 text-sm">
                Become more involved in the Bike Kitchen by volunteering or reach out directly 
                to me (Sahir) for vacancies
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-700 text-sm">
              You can find all of these links/pages in the app from now on by using the menu, 
              or the search icon in the top left corner.
            </p>
          </div>
        </section>

        <PrimaryButton
          onClick={handleGetStarted}
          fullWidth
        >
          Get Started
        </PrimaryButton>
      </div>
    </AppLayout>
  );
}