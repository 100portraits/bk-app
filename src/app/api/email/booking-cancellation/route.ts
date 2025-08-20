import { NextRequest, NextResponse } from 'next/server';
import { sendBookingCancellationEmail } from '@/lib/email/service';
import { BookingCancellationEmailData } from '@/lib/email/types';

export async function POST(request: NextRequest) {
  try {
    const data: BookingCancellationEmailData = await request.json();
    
    // Validate required fields
    if (!data.email || !data.date || !data.time || !data.repairType || !data.cancelledBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await sendBookingCancellationEmail(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('API error sending booking cancellation:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}