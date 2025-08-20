'use client';

import { useState, useImperativeHandle, forwardRef } from 'react';
import RecordWalkInDialog from './RecordWalkInDialog';
import ManageMembershipDialog from './ManageMembershipDialog';

export interface DialogLauncherRef {
  openDialog: (dialogId: string) => void;
}

const DialogLauncher = forwardRef<DialogLauncherRef>((_, ref) => {
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const openDialog = (dialogId: string) => {
    setOpenDialogs(prev => ({ ...prev, [dialogId]: true }));
  };

  const closeDialog = (dialogId: string) => {
    setOpenDialogs(prev => ({ ...prev, [dialogId]: false }));
  };

  useImperativeHandle(ref, () => ({
    openDialog
  }));

  return (
    <>
      {/* Record Walk-in Dialog */}
      <RecordWalkInDialog
        isOpen={openDialogs['record-walkin-dialog'] || false}
        onClose={() => closeDialog('record-walkin-dialog')}
      />

      {/* Manage Membership Dialog */}
      <ManageMembershipDialog
        isOpen={openDialogs['manage-membership-dialog'] || false}
        onClose={() => closeDialog('manage-membership-dialog')}
      />

      {/* Add more dialogs here as they are created */}
    </>
  );
});

DialogLauncher.displayName = 'DialogLauncher';

export default DialogLauncher;