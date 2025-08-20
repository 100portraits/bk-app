import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/singleton-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const email = request.nextUrl.searchParams.get('email');
    
    // Validate required parameters
    if (!bookingId || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    
    // Fetch the booking with shift details
    const { data: booking, error } = await supabase
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
    
    if (error || !booking) {
      console.error('Error fetching booking:', error);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify this is a guest booking and email matches
    if (booking.user_id !== null) {
      return NextResponse.json(
        { error: 'This is not a guest booking' },
        { status: 403 }
      );
    }
    
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match booking' },
        { status: 403 }
      );
    }
    
    // Return the booking data
    return NextResponse.json(booking);
  } catch (error) {
    console.error('API error fetching guest booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}