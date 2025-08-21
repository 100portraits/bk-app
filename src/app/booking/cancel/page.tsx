'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import { IconLoader2, IconCalendarEvent, IconClock, IconAlertCircle, IconCheck, IconArrowLeft, IconX } from '@tabler/icons-react';
import { Booking } from '@/types/bookings';
import { format, parseISO } from 'date-fns';

function CancelBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const bookingId = searchParams.get('id');
  const email = searchParams.get('email');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (bookingId && email) {
      fetchBooking();
    } else {
      setError('Invalid booking link. Please check your email and try again.');
      setLoading(false);
    }
  }, [bookingId, email]);

  const fetchBooking = async () => {
    if (!bookingId || !email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/guest/${bookingId}?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Booking not found. Please check your email and try again.');
        } else if (response.status === 403) {
          setError('You are not authorized to cancel this booking.');
        } else {
          setError('Failed to load booking details. Please try again.');
        }
        return;
      }
      
      const data = await response.json();
      setBooking(data);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId || !email) return;
    
    setCancelling(true);
    try {
      const response = await fetch('/api/bookings/guest/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, email })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel booking');
      }
      
      setCancelled(true);
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getRepairTypeDisplay = (repairType: string) => {
    const mapping: Record<string, string> = {
      'tire_tube': 'Tire/Tube',
      'chain': 'Chain',
      'brakes': 'Brakes',
      'gears': 'Gears',
      'wheel': 'Wheel',
      'other': 'Other'
    };
    return mapping[repairType] || repairType;
  };

  if (loading) {
    return (
      <AppLayout title="Cancel Booking">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Cancel Booking">
        <div className="max-w-2xl mx-auto py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <IconAlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-zinc-600 text-center mb-4">{error}</p>
            <PrimaryButton onClick={() => router.push('/')} size="sm">
              Back to Home
            </PrimaryButton>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (cancelled) {
    return (
      <AppLayout title="Booking Cancelled">
        <div className="max-w-2xl mx-auto py-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <IconCheck size={32} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">Booking Cancelled</h1>
              <p className="text-zinc-600">Your booking has been successfully cancelled.</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900">
                You will receive a confirmation email at <strong>{email}</strong>
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <PrimaryButton onClick={() => router.push('/')}>
                Back to Home
              </PrimaryButton>
              <SecondaryButton onClick={() => router.push(booking?.user_id ? '/booking' : '/booking/guest')}>
                Book New Appointment
              </SecondaryButton>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <AppLayout title="Cancel Booking">
      <div className="max-w-2xl mx-auto py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Back to home"
            >
              <IconArrowLeft size={24} className="text-zinc-600" />
            </button>
            <h1 className="text-3xl font-bold text-zinc-900">Cancel Your Booking</h1>
          </div>

          {booking.status === 'cancelled' ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <IconAlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <p className="text-yellow-900">
                  This booking has already been cancelled.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 bg-white border border-zinc-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Booking Details</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <IconCalendarEvent size={20} className="text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-600">Date & Time</p>
                      <p className="font-medium text-zinc-900">
                        {booking.shift && format(parseISO(booking.shift.date), 'EEEE, MMMM d, yyyy')}
                        {' at '}
                        {booking.slot_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <IconClock size={20} className="text-zinc-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-600">Repair Type & Duration</p>
                      <p className="font-medium text-zinc-900">
                        {getRepairTypeDisplay(booking.repair_type)} ({booking.duration_minutes} minutes)
                      </p>
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="pt-3 border-t border-zinc-100">
                      <p className="text-sm text-zinc-600">Notes</p>
                      <p className="text-zinc-900">{booking.notes}</p>
                    </div>
                  )}
                  
                  {booking.name && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm text-zinc-600">Name</p>
                        <p className="font-medium text-zinc-900">{booking.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <IconX className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-900 font-medium">Are you sure you want to cancel?</p>
                    <p className="text-red-700 text-sm mt-1">
                      This action cannot be undone. You'll need to book a new appointment if you change your mind.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => router.push('/')}
                  fullWidth
                >
                  Keep Booking
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => setShowConfirmDialog(true)}
                  fullWidth
                  className="bg-red-600 hover:bg-red-700"
                >
                  Cancel Booking
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <BottomSheetDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Confirm Cancellation"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900">
              Are you absolutely sure you want to cancel your booking for{' '}
              <strong>
                {booking.shift && format(parseISO(booking.shift.date), 'EEEE, MMMM d')} at {booking.slot_time.slice(0, 5)}
              </strong>?
            </p>
          </div>
          
          <p className="text-zinc-600 text-sm">
            You will receive a cancellation confirmation email at <strong>{email}</strong>
          </p>

          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => setShowConfirmDialog(false)}
              fullWidth
              disabled={cancelling}
            >
              No, Keep It
            </SecondaryButton>
            <PrimaryButton
              onClick={handleCancelBooking}
              fullWidth
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelling ? (
                <span className="flex items-center justify-center gap-2">
                  <IconLoader2 className="animate-spin" size={20} />
                  Cancelling...
                </span>
              ) : (
                'Yes, Cancel Booking'
              )}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>
    </AppLayout>
  );
}

export default function CancelBookingPage() {
  return (
    <Suspense fallback={
      <AppLayout title="Cancel Booking">
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="animate-spin" size={32} />
        </div>
      </AppLayout>
    }>
      <CancelBookingContent />
    </Suspense>
  );
}