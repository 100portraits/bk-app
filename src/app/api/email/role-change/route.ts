import { NextRequest, NextResponse } from 'next/server';
import { sendRoleChangeEmail } from '@/lib/email/service';
import { RoleChangeEmailData } from '@/lib/email/types';

export async function POST(request: NextRequest) {
  try {
    const data: RoleChangeEmailData = await request.json();
    
    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { error: 'Missing required email field' },
        { status: 400 }
      );
    }
    
    const result = await sendRoleChangeEmail(data);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('API error sending role change email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}