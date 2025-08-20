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
        className={`fixed bottom-4 left-4 text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-200 hover:bg-white hover:text-gray-600 hover:border-gray-300 transition-all cursor-pointer ${className}`}
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