# Resend Email Setup Guide for Tech Linkup

This guide will help you set up Resend to enable email notifications for event submissions.

## Overview

Tech Linkup uses **Resend** to send three types of transactional email notifications:

1. **Admin Notifications**: When a new event is submitted, all admins receive a notification
2. **Organizer Approval**: When an admin approves an event, the organizer receives a confirmation
3. **Organizer Rejection**: When an admin rejects an event, the organizer receives feedback

**Why Resend?**
- ✅ Built for transactional emails (perfect for notifications)
- ✅ Free tier: 100 emails/day, 3,000/month
- ✅ Server-side only (more secure than client-side solutions)
- ✅ Excellent deliverability rates
- ✅ No template management needed (templates are in code)
- ✅ Works immediately with their default domain

## Step 1: Create a Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email or GitHub account
3. Verify your email address
4. **No credit card required!**

## Step 2: Get Your API Key

1. After logging in, you'll be in the Resend dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name like "Tech Linkup Production"
5. Select **"Full access"** (or "Sending access" for production)
6. Click **"Add"**
7. **Copy the API key** - it starts with `re_` (e.g., `re_123abc456def...`)

   ⚠️ **Important**: This key will only be shown once! Save it securely.

## Step 3: Configure Environment Variables

### For Local Development (.env.local)

1. In your project root, create or open `.env.local`
2. Add your Resend API key:

```env
# Resend Configuration
RESEND_API_KEY=re_your_actual_api_key_here
```

**Example**:
```env
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno
```

### For Production (Vercel)

1. Go to your project on [Vercel Dashboard](https://vercel.com)
2. Click on your project → **Settings** → **Environment Variables**
3. Add the following variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (starts with `re_`)
   - **Environments**: Production, Preview, Development (select all)
4. Click **"Save"**
5. **Redeploy your application** for changes to take effect

## Step 4: Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Step 5: Test Email Notifications

### Test 1: New Submission Notification (Admin)

1. Go to `/submit-event` on your site
2. Fill out and submit a test event
3. Check your admin email inbox(es) - you should receive a beautifully formatted notification

**What the email includes:**
- Event title, date, and location
- Organizer name and email
- Tracking ID
- Direct link to review the submission in admin dashboard

### Test 2: Approval Notification (Organizer)

1. Log in to the admin dashboard at `/admin/login`
2. Go to `/admin/dashboard/submissions`
3. Find a pending submission
4. Click **"Approve & Publish"**
5. Check the organizer's email - they should receive an approval notification

**What the email includes:**
- Congratulatory message with 🎉 emoji
- Event details and tracking ID
- Link to view the published event on the site

### Test 3: Rejection Notification (Organizer)

1. In the admin dashboard submissions page
2. Click **"Reject"** on a pending submission
3. Add optional feedback (e.g., "Event doesn't meet our guidelines")
4. Check the organizer's email - they should receive a rejection notification

**What the email includes:**
- Polite rejection message
- Event details and tracking ID
- Admin feedback (if provided)
- Link to submit a new event

## Email Templates (React Email)

Tech Linkup uses **React Email** to build beautiful, maintainable email templates. All templates are in `lib/email/templates/` as React components:

### Template Files

1. **AdminNotificationEmail.tsx** - Notifies admins of new submissions
2. **OrganizerApprovedEmail.tsx** - Confirms event approval to organizers
3. **OrganizerRejectedEmail.tsx** - Notifies organizers of rejection with feedback

### Features

- **Component-based** - Write emails in React/TypeScript
- **Type-safe** - Full TypeScript support with props
- **Responsive design** - Looks great on desktop and mobile
- **Beautiful styling** - Professional gradient headers, card layouts
- **Brand colors** - Purple gradients for general, green for approvals, amber for updates
- **Preview locally** - Preview emails during development
- **Email client compatibility** - Works in Gmail, Outlook, Apple Mail, etc.

### Preview Email Templates Locally (Optional)

React Email includes a dev server to preview your templates:

1. Add preview script to `package.json`:
   ```json
   "scripts": {
     "email:dev": "email dev"
   }
   ```

2. Run the preview server:
   ```bash
   npm run email:dev
   ```

3. Open http://localhost:3000 to preview all templates

No need to manage templates in the Resend dashboard!

## Email Sending Domain

### Default Domain (Current Setup)

Emails are sent from: **`Tech Linkup <onboarding@resend.dev>`**

- ✅ Works immediately, no setup required
- ✅ Free tier includes this
- ✅ Good deliverability for transactional emails
- ✅ Perfect for getting started

**Email header example:**
```
From: Tech Linkup <onboarding@resend.dev>
Reply-To: noreply@techup-linkup.vercel.app
```

### Custom Domain (Optional Upgrade)

For better branding, you can send from your own domain (e.g., `noreply@techup-linkup.com`):

1. **Get a custom domain** (e.g., from Namecheap, GoDaddy) - ~$12/year
2. In Resend dashboard, go to **Domains** → **Add Domain**
3. Add your domain and follow the DNS setup instructions
4. Verify domain ownership
5. Update `FROM_EMAIL` in `lib/email/emailService.ts`:
   ```typescript
   const FROM_EMAIL = "Tech Linkup <noreply@yourdomain.com>";
   ```

**Benefits:**
- Professional branding
- Higher deliverability
- Custom email address

**Not required for launch!** The default domain works great.

## Resend Free Tier Limits

The free tier includes:

| Feature | Limit |
|---------|-------|
| **Emails per day** | 100 |
| **Emails per month** | 3,000 |
| **Domains** | 1 custom domain |
| **API Keys** | Unlimited |
| **Team members** | 1 (you) |
| **Email logs** | 30 days |

**For most use cases, this is plenty!**

**When to upgrade?**
- If you get more than 100 submissions/day
- If you need team collaboration
- If you want longer log retention

Paid plans start at $20/month for 50,000 emails.

## Monitoring & Logs

### View Email Status in Resend

1. Go to Resend dashboard → **Logs**
2. See all sent emails with status:
   - ✅ **Delivered** - Email successfully sent
   - 📧 **Queued** - Waiting to be sent
   - ❌ **Bounced** - Email address invalid
   - 🚫 **Complained** - Marked as spam

### View Logs in Your App

Check your server logs (Vercel logs or terminal) for:

```bash
✅ Admin notification sent to admin@example.com
✅ Organizer approval notification sent to organizer@example.com
✅ Organizer rejection notification sent to organizer@example.com
```

Or warnings if Resend isn't configured:
```bash
⚠️ Resend API key not configured. Skipping admin notification.
```

## Troubleshooting

### Emails Not Sending

**1. Check API Key**
   - Verify `RESEND_API_KEY` is set in `.env.local` or Vercel environment variables
   - Key should start with `re_`
   - No quotes needed in `.env.local`

**2. Check Server Logs**
   ```bash
   # In terminal or Vercel logs, look for:
   Error sending admin notification: [error message]
   ```

**3. Check Resend Dashboard**
   - Go to **Logs** in Resend dashboard
   - See if emails are being sent but bouncing
   - Check for error messages

**4. Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C) then restart
   npm run dev
   ```

### Common Issues

**"Resend API key not configured"**
- Add `RESEND_API_KEY` to your `.env.local` file
- Restart dev server

**"Email bounced"**
- Recipient email address is invalid
- Check for typos in email addresses

**"Rate limit exceeded"**
- You've hit the 100 emails/day limit on free tier
- Wait 24 hours or upgrade to a paid plan

**Emails going to spam**
- Normal for new domains/accounts
- Deliverability improves over time
- Ask admins to mark as "Not Spam"
- Consider custom domain for better reputation

### Testing Tips

**Use real email addresses** for testing:
- Use your own Gmail/Outlook for admin emails
- Use test email addresses for organizer emails
- Avoid using temporary/disposable email services (they often bounce)

**Check spam folders** if emails don't arrive in inbox

**Wait a few seconds** - Email delivery isn't instant (usually 1-5 seconds)

## Production Checklist

Before going live, ensure:

- [ ] `RESEND_API_KEY` is set in Vercel environment variables
- [ ] Test all three email types (admin notification, approval, rejection)
- [ ] Verify emails are delivered to admin inboxes
- [ ] Check spam folders and mark as "Not Spam" if needed
- [ ] Confirm email templates display correctly on mobile
- [ ] Monitor Resend dashboard for successful deliveries

## Email Flow Diagram

```
User Submits Event
        ↓
   [Database: event_submissions]
        ↓
   📧 Email sent to ALL Admins
        ↓
Admin Reviews Submission
        ↓
    ┌─────────┴─────────┐
    ↓                   ↓
 APPROVE             REJECT
    ↓                   ↓
Published to       Mark as Rejected
"events" table        in DB
    ↓                   ↓
📧 Approval Email  📧 Rejection Email
to Organizer       to Organizer
    ↓                   ↓
Includes event     Includes feedback
    URL            & resubmit link
```

## Advanced Configuration

### Custom Reply-To Email

By default, replies go to `noreply@techup-linkup.vercel.app`. To customize:

1. Add to `.env.local`:
   ```env
   REPLY_TO_EMAIL=support@yourdomain.com
   ```

2. Update `lib/email/emailService.ts` (already configured to use this):
   ```typescript
   const REPLY_TO = process.env.REPLY_TO_EMAIL || "noreply@techup-linkup.vercel.app";
   ```

### Customizing Email Templates

Email templates are React components in `lib/email/templates/`. To customize:

1. Open the template file you want to edit:
   - `lib/email/templates/AdminNotificationEmail.tsx` - Admin emails
   - `lib/email/templates/OrganizerApprovedEmail.tsx` - Approval emails
   - `lib/email/templates/OrganizerRejectedEmail.tsx` - Rejection emails

2. Edit the JSX and styles:
   ```tsx
   // Example: Change header color
   const header = {
     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Edit this
     padding: "40px 30px",
     textAlign: "center" as const,
   };
   ```

3. Save the file - Next.js will hot reload

4. Test by triggering the email action (submit event, approve, reject)

**Benefits of React Email:**
- Type-safe props with TypeScript
- Reusable components
- Preview changes instantly
- Better developer experience than raw HTML

For more advanced customizations, see the [React Email documentation](https://react.email).

## Support & Resources

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend API Reference**: [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **React Email Documentation**: [react.email](https://react.email)
- **React Email Components**: [react.email/docs/components](https://react.email/docs/components)
- **Email Templates**: `lib/email/templates/*.tsx`
- **Email Service**: `lib/email/emailService.ts`
- **Server Actions**: `app/actions/submission/*.ts`

## FAQ

**Q: Do I need to verify my email domain?**
A: No! With Resend's default domain (`onboarding@resend.dev`), you can start sending immediately.

**Q: Can I use Resend on a Vercel .vercel.app subdomain?**
A: Yes! Resend works perfectly on Vercel subdomains. You're using Resend's sending domain, not your own.

**Q: How much does Resend cost?**
A: Free tier: 100 emails/day (3,000/month). Paid plans start at $20/month for 50,000 emails.

**Q: Will emails go to spam?**
A: Resend has excellent deliverability. New accounts may see some emails in spam initially, but this improves quickly.

**Q: Can I send attachments?**
A: Yes! Resend supports attachments. See [docs](https://resend.com/docs/api-reference/emails/send-email#body-parameters) for examples.

**Q: How do I track email opens/clicks?**
A: Resend includes basic analytics in the dashboard. For advanced tracking, consider upgrading or using a dedicated analytics tool.

---

**Last Updated**: 2025-01-14
**Resend Package Version**: resend@latest
**React Email Version**: react-email@latest, @react-email/components@latest
**Next.js Version**: 15.5.6

**Ready to go live?** Just add your `RESEND_API_KEY` and start sending beautiful React-powered transactional emails! 🚀
