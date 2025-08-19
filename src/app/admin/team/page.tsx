'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PillButton from '@/components/ui/PillButton';
import { mockTeam } from '@/lib/placeholderData';

export default function ManageTeamPage() {
  const [showUserRoleDialog, setShowUserRoleDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');

  const handleUserClick = (user: string) => {
    setSelectedUser(user);
    setShowUserRoleDialog(true);
  };

  const handleSaveRole = () => {
    setShowUserRoleDialog(false);
    setSelectedUser('');
  };

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Manage Team</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Admins:</h3>
              <div className="flex flex-wrap gap-2">
                {mockTeam.admins.map((admin) => (
                  <button
                    key={admin}
                    onClick={() => handleUserClick(admin)}
                  >
                    <PillButton>{admin}</PillButton>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Mechanics:</h3>
              <div className="flex flex-wrap gap-2">
                {mockTeam.mechanics.map((mechanic) => (
                  <button
                    key={mechanic}
                    onClick={() => handleUserClick(mechanic)}
                  >
                    <PillButton>{mechanic}</PillButton>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Hosts:</h3>
              <div className="flex flex-wrap gap-2">
                {mockTeam.hosts.map((host) => (
                  <button
                    key={host}
                    onClick={() => handleUserClick(host)}
                  >
                    <PillButton>{host}</PillButton>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HelpButton
          text="Help with team management"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showUserRoleDialog}
        onClose={() => setShowUserRoleDialog(false)}
        title="User Role Management"
      >
        <div className="space-y-6">
          <div className="">
            <h3 className="text-xl font-semibold text-gray-900">{selectedUser}</h3>
            <p className="text-gray-600">Role: Admin</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Set Role:</h4>
            <div className="flex flex-wrap gap-2">
              {['Admin', 'Mechanic', 'Host'].map((role) => (
                <PillButton
                  key={role}
                  selected={selectedRole === role}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </PillButton>
              ))}
            </div>
          </div>

          <PrimaryButton
            onClick={handleSaveRole}
            fullWidth
          >
            Save
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with team management"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with team management? Describe any issues or questions you have:
          </p>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg resize-none"
            rows={4}
            placeholder="Write your message here..."
          />
          <PrimaryButton fullWidth>
            Send Message
          </PrimaryButton>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}