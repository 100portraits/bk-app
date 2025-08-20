'use client';

import { createContext, useContext, useRef } from 'react';
import DialogLauncher, { DialogLauncherRef } from '@/components/dialogs/DialogLauncher';

interface DialogContextType {
  openDialog: (dialogId: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const dialogLauncherRef = useRef<DialogLauncherRef>(null);

  const openDialog = (dialogId: string) => {
    dialogLauncherRef.current?.openDialog(dialogId);
  };

  return (
    <DialogContext.Provider value={{ openDialog }}>
      {children}
      <DialogLauncher ref={dialogLauncherRef} />
    </DialogContext.Provider>
  );
}