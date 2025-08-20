import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendBookingCancellationEmail } from '@/lib/email/service';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabase/singleton-client';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, email } = await request.json();
    
    // Validate required fields
    if (!bookingId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    
    // First fetch the booking to verify it exists and email matches
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        shift:shifts (
          date,
          day_of_week,
          start_time,
          end_time
        )
      `)
      .eq('id', bookingId)
      .single();
    
    if (fetchError || !booking) {
      console.error('Error fetching booking:', fetchError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify this is a guest booking
    if (booking.user_id !== null) {
      return NextResponse.json(
        { error: 'This is not a guest booking' },
        { status: 403 }
      );
    }
    
    // Verify email matches
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match booking' },
        { status: 403 }
      );
    }
    
    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }
    
    // Update the booking status to cancelled
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);
    
    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel booking' },
        { status: 500 }
      );
    }
    
    // Send cancellation email (non-blocking)
    if (booking.shift) {
      const repairTypeDisplay = getRepairTypeDisplay(booking.repair_type);
      const dateStr = format(parseISO(booking.shift.date), 'EEEE, MMMM d, yyyy');
      
      sendBookingCancellationEmail({
        email: booking.email,
        date: dateStr,
        time: booking.slot_time.substring(0, 5),
        repairType: repairTypeDisplay,
        cancelledBy: 'user',
        reason: 'Cancelled by guest'
      }).catch(err => {
        console.error('Failed to send cancellation email:', err);
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.error('API error cancelling guest booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

function getRepairTypeDisplay(repairType: string): string {
  const mapping: Record<string, string> = {
    'tire_tube': 'Tire/Tube',
    'chain': 'Chain',
    'brakes': 'Brakes',
    'gears': 'Gears',
    'wheel': 'Wheel',
    'other': 'Other'
  };
  return mapping[repairType] || repairType;
}