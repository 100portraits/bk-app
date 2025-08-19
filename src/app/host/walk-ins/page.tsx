'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import HelpButton from '@/components/ui/HelpButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import ToggleSelector from '@/components/ui/ToggleSelector';
import TextInput from '@/components/ui/TextInput';
import Avatar from '@/components/ui/Avatar';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { mockWalkIns } from '@/lib/placeholderData';

export default function WalkInsPage() {
  const [showWalkInDetails, setShowWalkInDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [selectedWalkIn, setSelectedWalkIn] = useState<typeof mockWalkIns[0] | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editIsMember, setEditIsMember] = useState('No');

  const handleWalkInClick = (walkIn: typeof mockWalkIns[0]) => {
    setSelectedWalkIn(walkIn);
    setShowWalkInDetails(true);
  };

  const handleEditClick = () => {
    if (selectedWalkIn) {
      setEditAmount(typeof selectedWalkIn.amount === 'number' ? selectedWalkIn.amount.toString() : '');
      setEditIsMember(selectedWalkIn.isCommunityMember ? 'Yes' : 'No');
      setShowWalkInDetails(false);
      setShowEditDialog(true);
    }
  };

  const handleSaveEdit = () => {
    setShowEditDialog(false);
    setSelectedWalkIn(null);
  };

  return (
    <AppLayout title="Host App">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Walk-ins</h2>
          <div className="space-y-3">
            {mockWalkIns.map((walkIn) => (
              <button
                key={walkIn.id}
                onClick={() => handleWalkInClick(walkIn)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar variant="secondary" />
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {typeof walkIn.amount === 'number' ? `€${walkIn.amount.toFixed(2)}` : walkIn.amount}
                    </div>
                    <div className="text-sm text-gray-600">
                      recorded at {walkIn.timestamp}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <HelpButton
          text="Help with recording/editing walk-ins"
          onClick={() => setShowHelpDialog(true)}
        />
      </div>

      <BottomSheetDialog
        isOpen={showWalkInDetails}
        onClose={() => setShowWalkInDetails(false)}
      >
        {selectedWalkIn && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Payment Amount:</span>
                <p className="font-medium">
                  {typeof selectedWalkIn.amount === 'number' ? `€${selectedWalkIn.amount.toFixed(2)}` : selectedWalkIn.amount}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Timestamp:</span>
                <p className="font-medium">Recorded at {selectedWalkIn.timestamp}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <PrimaryButton
                icon={<IconEdit size={18} />}
                onClick={handleEditClick}
                fullWidth
              >
                Edit
              </PrimaryButton>
              <SecondaryButton
                icon={<IconTrash size={18} />}
                fullWidth
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete
              </SecondaryButton>
            </div>
          </div>
        )}
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Edit Walk-In"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Community Member?
              </label>
              <ToggleSelector
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' }
                ]}
                value={editIsMember}
                onChange={setEditIsMember}
              />
            </div>

            {editIsMember === 'No' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount paid
                </label>
                <TextInput
                  placeholder="Value"
                  value={editAmount}
                  onChange={setEditAmount}
                  fullWidth
                />
              </div>
            )}
          </div>

          <PrimaryButton
            onClick={handleSaveEdit}
            fullWidth
          >
            Save
          </PrimaryButton>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        isOpen={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        title="Help with recording/editing walk-ins"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help with walk-ins? Describe any issues or questions you have:
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