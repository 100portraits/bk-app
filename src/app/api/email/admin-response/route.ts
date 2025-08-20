import { NextRequest, NextResponse } from 'next/server';
import { sendAdminResponseEmail } from '@/lib/email/service';
import { AdminResponseEmailData } from '@/lib/email/types';

export async function POST(request: NextRequest) {
  try {
    const data: AdminResponseEmailData = await request.json();
    
    // Validate required fields
    if (!data.email || !data.originalMessage || !data.adminResponse || !data.messagePage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await sendAdminResponseEmail(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('API error sending admin response:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}