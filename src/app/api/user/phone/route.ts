import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validatePhone } from '@/lib/utils/phone';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    // Validate phone
    const validation = validatePhone(phone);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Update user profile with phone
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ phone: validation.cleaned })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating phone:', updateError);
      return NextResponse.json(
        { error: 'Failed to update phone number' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error updating phone:', error);
    return NextResponse.json(
      { error: 'Failed to update phone number' },
      { status: 500 }
    );
  }
}
