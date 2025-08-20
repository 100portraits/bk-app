'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { IconLoader2, IconMessage, IconCheck, IconUser, IconTrash, IconAlertCircle, IconCornerUpLeft } from '@tabler/icons-react';
import { useRequireRole } from '@/hooks/useAuthorization';
import { useHelpMessages } from '@/hooks/useHelpMessages';
import { HelpMessage } from '@/types/help-messages';
import { format, parseISO } from 'date-fns';

export default function AdminMessagesPage() {
  const { authorized, loading: authLoading } = useRequireRole(['admin']);
  const { 
    messages, 
    loading, 
    respondToMessage,
    markAsRead,
    deleteMessage,
    refresh
  } = useHelpMessages();
  
  const [selectedMessage, setSelectedMessage] = useState<HelpMessage | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'responded'>('unread');

  // Filter messages based on selected filter
  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.responded_at;
    if (filter === 'responded') return !!msg.responded_at;
    return true;
  });

  // Sort messages: unread first, then by date
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    // Unread messages first
    if (!a.responded_at && b.responded_at) return -1;
    if (a.responded_at && !b.responded_at) return 1;
    // Then by date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleMessageClick = async (message: HelpMessage) => {
    setSelectedMessage(message);
    // Mark as read if not already
    if (!message.read_at) {
      await markAsRead(message.id);
      await refresh();
    }
  };

  const handleRespond = () => {
    if (selectedMessage) {
      setResponseText(selectedMessage.response || '');
      setShowResponseDialog(true);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    
    setIsResponding(true);
    try {
      await respondToMessage(selectedMessage.id, responseText.trim());
      await refresh();
      setShowResponseDialog(false);
      setSelectedMessage(null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response. Please try again.');
    } finally {
      setIsResponding(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    
    setIsDeleting(true);
    try {
      await deleteMessage(selectedMessage.id);
      await refresh();
      setShowDeleteDialog(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (authLoading) {
    return (
      <AppLayout title="Messages">
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
    <AppLayout title="Messages">
      <div className="space-y-6">
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">User Messages</h2>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({messages.filter(m => !m.responded_at).length})
            </button>
            <button
              onClick={() => setFilter('responded')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'responded' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Responded ({messages.filter(m => !!m.responded_at).length})
            </button>
          </div>

          {/* Messages List */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <IconLoader2 className="animate-spin" size={24} />
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <IconMessage size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'No unread messages' 
                  : filter === 'responded'
                  ? 'No responded messages'
                  : 'No messages yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`w-full p-4 bg-white border rounded-lg text-left hover:shadow-md transition-all ${
                    !message.responded_at 
                      ? 'border-purple-200 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconUser size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {message.user_name || (message.user_id ? 'Registered User' : 'Anonymous')}
                      </span>
                      {!message.responded_at && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">From: </span>
                    <span className="text-xs font-medium text-gray-700">{message.page_name}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.message}
                  </p>
                  
                  {message.responded_at && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <IconCheck size={14} />
                      <span>Responded {formatDate(message.responded_at)}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Message Details Dialog */}
      <BottomSheetDialog
        isOpen={!!selectedMessage && !showResponseDialog && !showDeleteDialog}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">User:</span>
              <p className="font-medium">
                {selectedMessage.user_name || (selectedMessage.user_id ? 'Registered User' : 'Anonymous')}
              </p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Page:</span>
              <p className="font-medium">{selectedMessage.page_name}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Received:</span>
              <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Message:</span>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
            
            {selectedMessage.response && (
              <div>
                <span className="text-sm text-gray-600">Your Response:</span>
                <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-900 whitespace-pre-wrap">{selectedMessage.response}</p>
                  {selectedMessage.responded_at && (
                    <p className="text-xs text-purple-600 mt-2">
                      Sent {formatDate(selectedMessage.responded_at)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <PrimaryButton
                icon={<IconCornerUpLeft size={18} />}
                onClick={handleRespond}
                fullWidth
              >
                {selectedMessage.responded_at ? 'Edit Response' : 'Respond'}
              </PrimaryButton>
              <SecondaryButton
                icon={<IconTrash size={18} />}
                onClick={() => setShowDeleteDialog(true)}
                fullWidth
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete
              </SecondaryButton>
            </div>
          </div>
        )}
      </BottomSheetDialog>

      {/* Response Dialog */}
      <BottomSheetDialog
        isOpen={showResponseDialog}
        onClose={() => setShowResponseDialog(false)}
        title="Send Response"
      >
        <div className="space-y-4">
          {selectedMessage && (
            <>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Original Message:</p>
                <p className="text-sm text-gray-700">{selectedMessage.message}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response:
                </label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none"
                  rows={6}
                  placeholder="Type your response here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  disabled={isResponding}
                />
              </div>
              
              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => setShowResponseDialog(false)}
                  fullWidth
                  disabled={isResponding}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={handleSendResponse}
                  fullWidth
                  disabled={isResponding || !responseText.trim()}
                >
                  {isResponding ? (
                    <span className="flex items-center justify-center gap-2">
                      <IconLoader2 className="animate-spin" size={20} />
                      Sending...
                    </span>
                  ) : (
                    'Send Response'
                  )}
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </BottomSheetDialog>

      {/* Delete Confirmation Dialog */}
      <BottomSheetDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Message"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <IconAlertCircle className="text-red-600 mt-0.5" size={20} />
              <div>
                <p className="text-red-900 font-medium">Are you sure you want to delete this message?</p>
                <p className="text-red-700 text-sm mt-1">
                  This action cannot be undone. The message and any response will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowDeleteDialog(false)}
              fullWidth
              disabled={isDeleting}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleDelete}
              fullWidth
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Deleting...
                </span>
              ) : (
                'Delete Message'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}