# Email Setup Guide for Bike Kitchen

## Overview
The Bike Kitchen app uses Resend for sending transactional emails. This guide will help you set up email functionality.

## Prerequisites
- Domain configured in Resend (bikekitchen.nl)
- Resend account with API access
- Vercel project for deployment

## Email Scenarios

The app sends emails in the following scenarios:

1. **Booking Confirmation** - When a user or guest confirms a booking
2. **Booking Cancellation** - When a user cancels their booking
3. **Admin Cancellation** - When an admin cancels a user's booking
4. **Admin Response** - When an admin responds to a help message
5. **Role Change** - When a user's role is changed (admin/mechanic/host)

## Setup Steps

### 1. Get Your Resend API Key

1. Log in to [Resend Dashboard](https://resend.com)
2. Navigate to **API Keys** section
3. Create a new API key with appropriate permissions
4. Copy the key (starts with `re_`)

### 2. Configure Local Development

Create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=re_your_api_key_here
```

**Important**: Never commit this file to version control!

### 3. Configure Vercel Production

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
   - **Environment**: Production (and optionally Preview)
5. Redeploy your application for changes to take effect

### 4. Domain Configuration

Ensure your domain (bikekitchen.nl) is properly configured in Resend:

1. In Resend dashboard, go to **Domains**
2. Verify `bikekitchen.nl` is listed and verified
3. Check that all DNS records are properly configured:
   - SPF record
   - DKIM records
   - DMARC record (optional but recommended)

## Testing

### Development Testing

In development mode, all emails are sent to `delivered@resend.dev` instead of real addresses. This allows you to test email functionality without sending actual emails.

To test:
1. Trigger any email action (booking, cancellation, etc.)
2. Check the Resend dashboard for email logs
3. Verify the email content and formatting

### Production Testing

In production, emails are sent to actual user email addresses. Test carefully:

1. Create a test user account
2. Perform actions that trigger emails
3. Verify emails are received correctly
4. Check spam folders if emails don't appear

## Email Templates

All email templates are located in `src/lib/email/templates/`:

- `booking-confirmation.tsx` - Booking confirmation template
- `booking-cancellation.tsx` - Cancellation notification template
- `admin-response.tsx` - Admin response to help messages
- `role-change.tsx` - Role change notification

### Customizing Templates

To modify email templates:

1. Edit the relevant template file
2. Keep the React component structure
3. Use inline styles (email clients don't support external CSS)
4. Test thoroughly across different email clients

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look for errors in Vercel logs or console
3. **Verify Domain**: Ensure domain is verified in Resend
4. **Check Quota**: Verify you haven't exceeded Resend limits

### Emails Going to Spam

1. **SPF/DKIM**: Ensure DNS records are properly configured
2. **Content**: Avoid spam trigger words
3. **From Address**: Use `noreply@bikekitchen.nl`
4. **Reply-To**: Set to `info@bikekitchen.nl`

### Development Issues

- Emails in dev go to `delivered@resend.dev`
- Check NODE_ENV is set to 'development'
- Verify local .env.local file exists and is loaded

## API Endpoints

The following API routes handle email sending:

- `POST /api/email/booking-confirmation` - Send booking confirmation
- `POST /api/email/booking-cancellation` - Send cancellation notice
- `POST /api/email/admin-response` - Send admin response
- `POST /api/email/role-change` - Send role change notification

## Security Notes

1. **Never expose API keys** in client-side code
2. **Use environment variables** for sensitive data
3. **Validate inputs** in API routes
4. **Rate limit** email endpoints if needed
5. **Log errors** but not sensitive data

## Support

For issues with:
- **Resend**: Contact support@resend.com
- **App Issues**: Create an issue in the repository
- **Domain/DNS**: Contact your domain registrar