'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import DismissableCard from '@/components/ui/DismissableCard';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import VersionTracker from '@/components/ui/VersionTracker';
import { IconPlus } from '@tabler/icons-react';
import { quickLinksOptions, widgetOptions } from '@/lib/placeholderData';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [showQuickLinksDialog, setShowQuickLinksDialog] = useState(false);
  const [showWidgetsDialog, setShowWidgetsDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <AppLayout 
      title="Home"
      showUserRoles={false}
    >
      <div className="space-y-6">
        <DismissableCard
          id="welcome-message"
          title="Welcome to the new Bike Kitchen app!"
          color="purple"
        >
          <div className="space-y-2">
            <p>There may be bugs! Sorry, I'm a team of one :)</p>
            
            <p>
              At the bottom of each page you'll find a 'Help' button, please write to me here I'll try and fix them ASAP. Thanks!
            </p>
            
            <p className="font-medium">- sahir</p>
          </div>
        </DismissableCard>

        {!profile?.member && (
          <DismissableCard
            id="membership-prompt"
            title="Are you a Member?"
            color="green"
          >
            <div>
              <p className="mb-3 inline">
                <button
                onClick={() => router.push('/become-member')}
                className="text-green-700 underline hover:text-green-800 font-medium inline"
              >
                Indicate your membership here
              </button> <br></br>and access your previous bookings and an event calendar!
              </p>
              
            </div>
          </DismissableCard>
        )}

        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Roles</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.member ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Member
              </span>
            ) : (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Non-Member
              </span>
            )}
            {profile?.role && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {profile.role}
              </span>
            )}
            {!profile?.role && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                No roles assigned
              </span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <button
            onClick={() => setShowQuickLinksDialog(true)}
            className="w-full h-24 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors"
          >
            <IconPlus size={32} className="text-purple-400" />
          </button>
        </section>

        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Widgets</h2>
          <button
            onClick={() => setShowWidgetsDialog(true)}
            className="w-full h-24 bg-purple-50 border-2 border-dashed border-purple-200 rounded-lg flex items-center justify-center hover:bg-purple-100 transition-colors"
          >
            <IconPlus size={32} className="text-purple-400" />
          </button>
        </section>

        <HelpButton
          text="Help with the homepage"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showQuickLinksDialog}
        onClose={() => setShowQuickLinksDialog(false)}
        title="Add Quick Link"
      >
        <div className="space-y-3">
          {quickLinksOptions.map((option) => (
            <NavigationCard
              key={option.id}
              title={option.title}
              subtitle={option.subtitle}
              variant="secondary"
              onClick={() => {
                setShowQuickLinksDialog(false);
              }}
            />
          ))}
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showWidgetsDialog}
        onClose={() => setShowWidgetsDialog(false)}
        title="Add Widget"
      >
        <div className="space-y-4">
          {widgetOptions.map((widget) => (
            <div key={widget.id} className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <h3 className="font-medium text-gray-900">{widget.title}</h3>
              <p className="text-sm text-gray-600">{widget.subtitle}</p>
            </div>
          ))}
        </div>
      </BottomSheetDialog>

      <HelpDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        pageName="Homepage"
      />
      
      <VersionTracker />
    </AppLayout>
  );
}