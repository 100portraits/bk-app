'use client';

import React from 'react';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { useHelpMessages } from '@/hooks/useHelpMessages';
import { format, parseISO } from 'date-fns';
import { IconLoader2, IconMessage, IconCheck, IconClock } from '@tabler/icons-react';

interface MessagesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagesDialog({ isOpen, onClose }: MessagesDialogProps) {
  const { 
    messages, 
    loading, 
  } = useHelpMessages();

  // Messages are loaded automatically by the hook

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${format(date, 'HH:mm')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, yyyy at HH:mm');
    }
  };

  return (
    <BottomSheetDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Your Messages"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader2 className="animate-spin" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <IconMessage size={48} className="mx-auto text-zinc-400 mb-3" />
            <p className="text-zinc-500">No messages yet</p>
            <p className="text-sm text-zinc-400 mt-1">
              Messages you send through help dialogs will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 bg-white border border-zinc-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {message.page_name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  {message.responded_at ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <IconCheck size={14} />
                      Responded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <IconClock size={14} />
                      Pending
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-zinc-700 mb-2">
                  {message.message}
                </p>
                
                {message.response && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-md border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Response:</p>
                    <p className="text-sm text-purple-900">
                      {message.response}
                    </p>
                    {message.responded_at && (
                      <p className="text-xs text-purple-600 mt-2">
                        {formatDate(message.responded_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheetDialog>
  );
}