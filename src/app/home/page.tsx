'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import NavigationCard from '@/components/ui/NavigationCard';
import QuickLinkCard from '@/components/ui/QuickLinkCard';
import HelpButton from '@/components/ui/HelpButton';
import HelpDialog from '@/components/ui/HelpDialog';
import DismissableCard from '@/components/ui/DismissableCard';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import VersionTracker from '@/components/ui/VersionTracker';
import { IconPlus, IconInfoCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuickLinks } from '@/hooks/useQuickLinks';

export default function HomePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [showQuickLinksDialog, setShowQuickLinksDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { 
    quickLinks, 
    availableByCategory, 
    addQuickLink, 
    removeQuickLink,
    isQuickLink,
    hasReachedLimit 
  } = useQuickLinks();

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
                className="text-green-700 underline hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium inline"
              >
                Indicate your membership here
              </button> <br></br>and access your previous bookings and an event calendar!
              </p>
              
            </div>
          </DismissableCard>
        )}

        <section>
          <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">My Roles</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.member ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Member
              </span>
            ) : (
              <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium">
                Non-Member
              </span>
            )}
            {profile?.role && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {profile.role}
              </span>
            )}
            {!profile?.role && (
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-sm">
                No roles assigned
              </span>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-white">Quick Links</h2>
            {quickLinks.length > 0 && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium"
              >
                {editMode ? 'Done' : 'Edit'}
              </button>
            )}
          </div>
          
          {quickLinks.length === 0 ? (
            <div className="space-y-3">
              <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 text-center">
                <IconInfoCircle size={32} className="mx-auto text-zinc-400 dark:text-zinc-500 mb-2" />
                <p className="text-zinc-600 dark:text-zinc-400 mb-3">No quick links added yet</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Add your favorite actions for quick access from the homepage
                </p>
              </div>
              <button
                onClick={() => setShowQuickLinksDialog(true)}
                className="w-full h-24 bg-accent-50 dark:bg-accent-950 border-2 border-dashed border-accent-200 dark:border-accent-700 rounded-lg flex items-center justify-center hover:bg-accent-100 dark:hover:bg-accent-900 transition-colors"
              >
                <IconPlus size={32} className="text-accent-400 dark:text-accent-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quickLinks.map((action) => (
                <QuickLinkCard
                  key={action.id}
                  action={action}
                  editMode={editMode}
                  onRemove={() => removeQuickLink(action.id)}
                />
              ))}
              
              {!hasReachedLimit && (
                <button
                  onClick={() => setShowQuickLinksDialog(true)}
                  className="w-full h-20 bg-accent-50 dark:bg-accent-950 border-2 border-dashed border-accent-200 dark:border-accent-700 rounded-lg flex items-center justify-center hover:bg-accent-100 dark:hover:bg-accent-900 transition-colors"
                >
                  <IconPlus size={24} className="text-accent-400 dark:text-accent-500" />
                </button>
              )}
            </div>
          )}
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
        scrollable
        maxHeight='80vh'
      >
        <div className="space-y-6">
          {hasReachedLimit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                You've reached the maximum of 8 quick links. Remove some to add more.
              </p>
            </div>
          )}
          
          {/* Booking Actions */}
          {availableByCategory.booking.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Booking</h3>
              <div className="space-y-2">
                {availableByCategory.booking.map((action) => {
                  const Icon = action.icon;
                  return (
                    <NavigationCard
                      key={action.id}
                      title={action.title}
                      subtitle={action.subtitle}
                      variant={action.variant || 'secondary'}
                      icon={Icon ? <Icon size={24} /> : undefined}
                      onClick={() => {
                        if (!isQuickLink(action.id)) {
                          addQuickLink(action.id);
                        }
                        setShowQuickLinksDialog(false);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Host Actions */}
          {availableByCategory.host.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Host Tools</h3>
              <div className="space-y-2">
                {availableByCategory.host.map((action) => {
                  const Icon = action.icon;
                  return (
                    <NavigationCard
                      key={action.id}
                      title={action.title}
                      subtitle={action.subtitle}
                      variant={action.variant || 'secondary'}
                      icon={Icon ? <Icon size={24} /> : undefined}
                      onClick={() => {
                        if (!isQuickLink(action.id)) {
                          addQuickLink(action.id);
                        }
                        setShowQuickLinksDialog(false);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Admin Actions */}
          {availableByCategory.admin.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Admin</h3>
              <div className="space-y-2">
                {availableByCategory.admin.map((action) => {
                  const Icon = action.icon;
                  return (
                    <NavigationCard
                      key={action.id}
                      title={action.title}
                      subtitle={action.subtitle}
                      variant={action.variant || 'secondary'}
                      icon={Icon ? <Icon size={24} /> : undefined}
                      onClick={() => {
                        if (!isQuickLink(action.id)) {
                          addQuickLink(action.id);
                        }
                        setShowQuickLinksDialog(false);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Membership Actions */}
          {availableByCategory.membership.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Membership</h3>
              <div className="space-y-2">
                {availableByCategory.membership.map((action) => {
                  const Icon = action.icon;
                  return (
                    <NavigationCard
                      key={action.id}
                      title={action.title}
                      subtitle={action.subtitle}
                      variant={action.variant || 'secondary'}
                      icon={Icon ? <Icon size={24} /> : undefined}
                      onClick={() => {
                        if (!isQuickLink(action.id)) {
                          addQuickLink(action.id);
                        }
                        setShowQuickLinksDialog(false);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Show message if no actions available */}
          {Object.values(availableByCategory).every(category => category.length === 0) && (
            <div className="text-center py-6 text-zinc-500 dark:text-zinc-400">
              <p>All available actions have been added to quick links.</p>
            </div>
          )}
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