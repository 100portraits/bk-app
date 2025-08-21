'use client';

import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { versionHistory, currentVersion } from '@/lib/versionHistory';
import { IconCircleFilled } from '@tabler/icons-react';

interface VersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionDialog({ isOpen, onClose }: VersionDialogProps) {
  const getVersionColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'text-red-600 bg-red-50';
      case 'minor':
        return 'text-blue-600 bg-blue-50';
      case 'patch':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-zinc-600 bg-zinc-50';
    }
  };

  return (
    <BottomSheetDialog
      title="Version History"
      isOpen={isOpen}
      onClose={onClose}
      scrollable
      maxHeight='85vh'
    >
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Current Version</span>
            <span className="text-lg font-bold text-purple-900">{currentVersion}</span>
          </div>
          <p className="text-xs text-purple-600">
            Debug mode enabled - Tracking development progress
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {versionHistory.map((version, index) => (
            <div
              key={version.version}
              className={`border rounded-lg p-4 ${
                index === 0 ? 'border-purple-200 bg-purple-50/30' : 'border-zinc-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900">
                    v{version.version}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVersionColor(version.type)}`}>
                    {version.type}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500">{version.date}</span>
              </div>
              
              <ul className="space-y-1">
                {version.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start gap-2 text-sm text-zinc-600">
                    <IconCircleFilled size={6} className="mt-1.5 flex-shrink-0 text-zinc-400" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-zinc-500 space-y-1">
            <p><strong>Version numbering:</strong></p>
            <p>• Major (x.0.0): Breaking changes or major features</p>
            <p>• Minor (0.x.0): New features or significant improvements</p>
            <p>• Patch (0.0.x): Bug fixes and small tweaks</p>
          </div>
        </div>
      </div>
    </BottomSheetDialog>
  );
}