# Quick Email Service Setup Guide

This guide will help you set up the Resend email service in just a few minutes.

## Step 1: Get Resend API Key

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Create a free account (no credit card required)
3. Verify your email address
4. Navigate to **API Keys** in the dashboard
5. Click **Create API Key**
6. Copy your API key (starts with `re_`)

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=onboarding@resend.dev  # Use this for testing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** For production, you'll need to verify your own domain with Resend and use your domain email address.

## Step 3: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000](http://localhost:3000)

3. Scroll to the footer

4. Enter your email and click "Subscribe"

5. Check your inbox for the confirmation email!

## Step 4: Production Setup (Optional)

For production deployment:

1. **Verify Your Domain** in Resend dashboard
   - Add DNS records (SPF, DKIM) provided by Resend
   - Wait for verification (usually a few minutes)

2. **Update Environment Variables**
   ```bash
   FROM_EMAIL=newsletter@yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourblog.com
   ```

3. **Deploy** your application

## Features Available

Once set up, you have:

✅ **Subscription Management**
- Users can subscribe via footer form
- Automatic welcome emails
- One-click unsubscribe

✅ **Post Notifications**
- New posts automatically notify all subscribers
- Beautiful email templates with post preview
- Batch sending for scalability

✅ **Admin Onboarding**
- New admins receive welcome emails
- Login credentials included
- Security reminders

## Troubleshooting

**Emails not sending?**
- Check that `RESEND_API_KEY` is set correctly
- Verify the API key is active in Resend dashboard
- Check server logs for error messages

**Emails going to spam?**
- Verify your domain in Resend (for production)
- Ensure FROM_EMAIL matches verified domain
- Add SPF and DKIM DNS records

**Database errors?**
- The `subscribers` table is created automatically
- If issues persist, check PostgreSQL connection
- Verify database is accessible

## Rate Limits

**Resend Free Tier:**
- 100 emails per day
- 3,000 emails per month
- Perfect for testing and small blogs

**Resend Pro ($20/month):**
- 50,000 emails per month
- Higher sending rates
- Better for growing blogs

## Next Steps

- Read the full [EMAIL_SERVICE.md](EMAIL_SERVICE.md) documentation
- Customize email templates in `src/lib/email.ts`
- Set up domain verification for production
- Monitor email delivery in Resend dashboard

## Need Help?

- 📖 Full documentation: [EMAIL_SERVICE.md](EMAIL_SERVICE.md)
- 🌐 Resend docs: [https://resend.com/docs](https://resend.com/docs)
- 💬 Resend support: Available in their dashboard

---

That's it! Your email service is now ready to use. 🎉
