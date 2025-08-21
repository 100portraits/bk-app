'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import HelpDialog from '@/components/ui/HelpDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PillButton from '@/components/ui/PillButton';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/hooks/useTeam';
import { IconLoader2, IconUserOff } from '@tabler/icons-react';
import { UserRole, UserProfile } from '@/types/auth';

export default function ManageTeamPage() {
  const { authorized, loading: authLoading } = useRequireRole(['admin']);
  const { user } = useAuth();
  const [showUserRoleDialog, setShowUserRoleDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'remove'>('host');
  const [saving, setSaving] = useState(false);
  
  const { 
    teamMembers, 
    loading, 
    updateMemberRole, 
    removeMember, 
  } = useTeam();

  // Team members are loaded automatically by the hook

  const handleUserClick = (member: UserProfile) => {
    setSelectedUser(member);
    setSelectedRole(member.role || 'remove');
    setShowUserRoleDialog(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    // Prevent users from editing their own role
    if (selectedUser.id === user?.id) {
      return;
    }

    setSaving(true);
    try {
      if (selectedRole === 'remove') {
        await removeMember(selectedUser.id);
      } else {
        await updateMemberRole(selectedUser.id, selectedRole as UserRole);
      }
      
      setShowUserRoleDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setSaving(false);
    }
  };

  // Group team members by role
  const admins = teamMembers.filter(m => m.role === 'admin');
  const mechanics = teamMembers.filter(m => m.role === 'mechanic');
  const hosts = teamMembers.filter(m => m.role === 'host');

  if (authLoading) {
    return (
      <AppLayout title="Manage Team">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <AppLayout title="Manage Team">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Manage Team</h2>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <IconLoader2 className="animate-spin" size={24} />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No team members found.</p>
              <p className="text-sm mt-2">Team members are users with assigned roles (admin, mechanic, or host).</p>
            </div>
          ) : (
            <div className="space-y-6">
              {admins.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Admins ({admins.length}):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {admins.map((admin) => (
                      <PillButton
                        key={admin.id}
                        onClick={() => handleUserClick(admin)}
                      >
                        {admin.email}
                      </PillButton>
                    ))}
                  </div>
                </div>
              )}

              {mechanics.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Mechanics ({mechanics.length}):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mechanics.map((mechanic) => (
                      <PillButton
                        key={mechanic.id}
                        onClick={() => handleUserClick(mechanic)}
                      >
                        {mechanic.email}
                      </PillButton>
                    ))}
                  </div>
                </div>
              )}

              {hosts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Hosts ({hosts.length}):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hosts.map((host) => (
                      <PillButton
                        key={host.id}
                        onClick={() => handleUserClick(host)}
                      >
                        {host.email}
                      </PillButton>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
        scrollable={true}
        maxHeight="60vh"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="">
              <h3 className="text-xl font-semibold text-gray-900">{selectedUser.email}</h3>
              <p className="text-gray-600">
                Current Role: {selectedUser.role ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) : 'None'}
              </p>
              <p className="text-gray-500 text-sm">
                Member Status: {selectedUser.member ? 'Member' : 'Non-Member'}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Change Role To:</h4>
              <div className="flex flex-wrap gap-2">
                {(['admin', 'mechanic', 'host'] as const).map((role) => (
                  <PillButton
                    key={role}
                    selected={selectedRole === role}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </PillButton>
                ))}
                <button
                  onClick={() => setSelectedRole('remove')}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedRole === 'remove'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <IconUserOff size={16} />
                    Remove from Team
                  </span>
                </button>
              </div>
            </div>

            {selectedRole === 'remove' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  This will remove the user's role. They will no longer be able to access team features, but their account and membership status will remain unchanged.
                </p>
              </div>
            )}

            {selectedUser.id === user?.id && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800 font-medium">
                  You cannot modify your own role
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Ask another admin to change your role if needed.
                </p>
              </div>
            )}

            <PrimaryButton
              onClick={handleSaveRole}
              fullWidth
              disabled={saving || selectedUser.id === user?.id}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </PrimaryButton>
          </div>
        )}
      </BottomSheetDialog>

      <HelpDialog 
        isOpen={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
        pageName="Team Management" 
      />
    </AppLayout>
  );
}