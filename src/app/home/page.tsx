'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RoleBadge from '@/components/ui/RoleBadge';
import NavigationCard from '@/components/ui/NavigationCard';
import HelpButton from '@/components/ui/HelpButton';
import WelcomeModal from '@/components/ui/WelcomeModal';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconPlus } from '@tabler/icons-react';
import { mockUser, quickLinksOptions, widgetOptions } from '@/lib/placeholderData';

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuickLinksDialog, setShowQuickLinksDialog] = useState(false);
  const [showWidgetsDialog, setShowWidgetsDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <AppLayout 
      title="Home"
      showUserRoles={false}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Roles</h2>
          <div className="flex flex-wrap gap-2">
            {mockUser.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
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

      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

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

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with the homepage"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with the homepage? Describe any issues or questions you have:
          </p>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="Write your message here..."
          />
          <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors">
            Send Message
          </button>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}