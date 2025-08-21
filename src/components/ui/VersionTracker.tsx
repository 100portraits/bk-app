'use client';

import { useState } from 'react';
import { currentVersion } from '@/lib/versionHistory';
import VersionDialog from './VersionDialog';

interface VersionTrackerProps {
  className?: string;
}

export default function VersionTracker({ className = '' }: VersionTrackerProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={`fixed bottom-4 left-4 text-xs text-zinc-400 dark:text-zinc-500 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer ${className}`}
      >
        v{currentVersion}
      </button>
      
      <VersionDialog 
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}