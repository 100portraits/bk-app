import * as React from 'react';
import resend from './resend';
import { 
  BookingConfirmationEmailData, 
  BookingCancellationEmailData,
  AdminResponseEmailData,
  RoleChangeEmailData,
  EmailResponse 
} from './types';
import { BookingConfirmationEmail } from './templates/booking-confirmation';
import { BookingCancellationEmail } from './templates/booking-cancellation';
import { AdminResponseEmail } from './templates/admin-response';
import { RoleChangeEmail } from './templates/role-change';

const FROM_EMAIL = 'Bike Kitchen <noreply@bikekitchen.nl>';
const REPLY_TO_EMAIL = 'info@bikekitchen.nl';

// Helper function to determine if we're in development
const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use test email; in production, use real email
const getRecipientEmail = (email: string) => {
  return isDevelopment ? 'delivered@resend.dev' : email;
};

export async function sendBookingConfirmationEmail(
  data: BookingConfirmationEmailData
): Promise<EmailResponse> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: getRecipientEmail(data.email),
      replyTo: REPLY_TO_EMAIL,
      subject: `Booking Confirmed - ${data.date} at ${data.time}`,
      react: <BookingConfirmationEmail
        date={data.date}
        time={data.time}
        repairType={data.repairType}
        duration={data.duration}
        isGuest={data.isGuest}
        bookingId={data.bookingId}
        email={data.email}
      />,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendBookingCancellationEmail(
  data: BookingCancellationEmailData
): Promise<EmailResponse> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: getRecipientEmail(data.email),
      replyTo: REPLY_TO_EMAIL,
      subject: `Booking Cancelled - ${data.date} at ${data.time}`,
      react: <BookingCancellationEmail
        date={data.date}
        time={data.time}
        repairType={data.repairType}
        cancelledBy={data.cancelledBy}
        reason={data.reason}
      />,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending booking cancellation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendAdminResponseEmail(
  data: AdminResponseEmailData
): Promise<EmailResponse> {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: getRecipientEmail(data.email),
      replyTo: REPLY_TO_EMAIL,
      subject: 'Response to your help request - Bike Kitchen',
      react: <AdminResponseEmail
        userName={data.userName}
        originalMessage={data.originalMessage}
        adminResponse={data.adminResponse}
        messagePage={data.messagePage}
      />,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending admin response email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendRoleChangeEmail(
  data: RoleChangeEmailData
): Promise<EmailResponse> {
  try {
    const roleDisplay = data.newRole 
      ? data.newRole.charAt(0).toUpperCase() + data.newRole.slice(1)
      : 'Regular User';
      
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: getRecipientEmail(data.email),
      replyTo: REPLY_TO_EMAIL,
      subject: `Role Updated: ${roleDisplay} - Bike Kitchen`,
      react: <RoleChangeEmail
        userName={data.userName}
        newRole={data.newRole}
        previousRole={data.previousRole}
      />,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending role change email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}