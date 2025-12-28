# Email Service Implementation

This document describes the implementation of the Resend email service for the blog, covering subscription management, notifications, and admin communications.

## Overview

The blog uses [Resend](https://resend.com/) as the email service provider to handle:
- **Subscription confirmations** - Welcome emails when users subscribe
- **New post notifications** - Alerts to subscribers when new content is published
- **Admin creation emails** - Welcome emails with credentials for new admin users
- **Unsubscribe confirmations** - Confirmation when users unsubscribe

## Architecture

### Database Schema

#### Subscribers Table
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribe_token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

**Indexes:**
- `idx_subscribers_email` - Fast email lookups
- `idx_subscribers_token` - Fast token-based unsubscribe lookups
- `idx_subscribers_active` - Filter active subscribers efficiently

### Email Service (`/src/lib/email.ts`)

The email service provides four main functions:

#### 1. `sendSubscriptionConfirmationEmail(email, unsubscribeToken)`
Sends a welcome email when a user subscribes to the blog.
- Beautiful gradient design
- Includes unsubscribe link
- Returns success/error status

#### 2. `sendNewPostNotification(postTitle, postExcerpt, postSlug, postImage?)`
Notifies all active subscribers about a new blog post.
- Sends emails in batches of 50 to avoid rate limits
- Includes post image if available
- Each email contains a personalized unsubscribe link
- Returns count of emails sent

#### 3. `sendAdminCreationEmail(email, name, temporaryPassword)`
Sends credentials and welcome information to newly created admin users.
- Includes login URL
- Shows temporary password (with security warning)
- Lists admin capabilities
- Professional, branded design

#### 4. `sendUnsubscribeConfirmationEmail(email)`
Confirms successful unsubscription.
- Simple, respectful message
- Includes link to resubscribe if desired

## API Endpoints

### Subscribe to Blog
**POST** `/api/subscribers`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "message": "Successfully subscribed! Check your email for confirmation.",
  "subscriber": {
    "id": "uuid",
    "email": "user@example.com",
    "subscribed_at": "2025-12-27T..."
  }
}
```

**Error Cases:**
- 400: Missing or invalid email
- 409: Email already subscribed
- 500: Server error

### Unsubscribe from Blog
**POST** `/api/subscribers/unsubscribe`

**Request Body:**
```json
{
  "token": "hex-token-string"
}
```

**Response (Success):**
```json
{
  "message": "Successfully unsubscribed from blog updates"
}
```

**GET** `/api/subscribers/unsubscribe?token={token}`

Returns subscriber information for the unsubscribe page.

## Frontend Components

### Updated Footer Component
The footer now includes a functional subscription form:
- Real-time validation
- Loading states
- Success/error messages
- Prevents duplicate submissions

### Unsubscribe Page (`/unsubscribe`)
A dedicated page for handling unsubscriptions:
- Fetches subscriber info by token
- Displays confirmation before unsubscribing
- Shows appropriate messages for different states
- Provides link back to blog

## Email Templates

All emails use:
- Responsive HTML design
- Mobile-friendly layouts
- Consistent branding with gradient colors
- Professional typography
- Clear call-to-action buttons

### Color Scheme
- Primary gradient: `#667eea` to `#764ba2`
- Background: White with subtle gray accents
- Text: Dark gray for readability

## Environment Variables

Add these to your `.env.local` file:

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxx

# From email address (must be verified domain with Resend)
FROM_EMAIL=noreply@yourdomain.com

# Site URL for links in emails
NEXT_PUBLIC_SITE_URL=https://yourblog.com
```

## Setup Instructions

### 1. Create Resend Account
1. Go to [https://resend.com/](https://resend.com/)
2. Sign up for a free account
3. Verify your domain (or use their test domain for development)

### 2. Get API Key
1. Navigate to API Keys in Resend dashboard
2. Create a new API key
3. Copy the key (starts with `re_`)

### 3. Configure Environment Variables
Add the required variables to `.env.local`:
```bash
RESEND_API_KEY=your_api_key_here
FROM_EMAIL=onboarding@resend.dev  # Use resend.dev for testing
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Or your production URL
```

### 4. Initialize Database
The subscribers table will be created automatically when you run the app, or you can manually run:
```sql
-- Run this in your PostgreSQL database
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribe_token VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_token ON subscribers(unsubscribe_token);
CREATE INDEX idx_subscribers_active ON subscribers(is_active);
```

### 5. Test the Implementation
1. Start your development server: `npm run dev`
2. Navigate to the homepage
3. Scroll to the footer and enter your email
4. Check your inbox for the confirmation email
5. Create a test blog post to verify subscriber notifications

## Integration Points

### New Post Creation
When a new post is created via `/api/posts`:
- The system automatically detects new posts (no `id` provided)
- Sends notifications to all active subscribers
- Emails are sent asynchronously (doesn't block API response)
- Can be disabled by setting `sendNotification: false` in request body

### Admin User Creation
When a new admin is created via `/api/admin`:
- Welcome email is sent automatically
- Includes temporary password and login instructions
- Email sent asynchronously

## Rate Limits and Batch Processing

### Subscriber Notifications
- Emails sent in batches of 50
- 1-second delay between batches
- Prevents rate limit issues with Resend
- Suitable for thousands of subscribers

### Resend Limits
**Free tier:**
- 100 emails/day
- 3,000 emails/month

**Pro tier ($20/month):**
- 50,000 emails/month
- Higher rate limits

## Best Practices

### Email Deliverability
1. **Verify your domain** with Resend for better deliverability
2. **Use a professional FROM address** (e.g., `newsletter@yourdomain.com`)
3. **Keep subject lines clear** and under 50 characters
4. **Always include unsubscribe links** (required by law)

### User Experience
1. **Immediate feedback** - Show loading states during API calls
2. **Clear messaging** - Explain what users are subscribing to
3. **Easy unsubscribe** - One-click process, no login required
4. **Confirmation emails** - Let users know their action was successful

### Security
1. **Unique tokens** - Use crypto.randomBytes for unsubscribe tokens
2. **Lowercase emails** - Store emails in lowercase for consistency
3. **Validate email format** - Both client and server-side
4. **Rate limiting** - Consider adding rate limits to prevent abuse

### Performance
1. **Async email sending** - Don't block API responses waiting for emails
2. **Batch processing** - Send to multiple subscribers efficiently
3. **Error handling** - Log failures but don't break user flow

## Monitoring and Debugging

### Check Email Delivery
1. Log in to [Resend Dashboard](https://resend.com/emails)
2. View all sent emails and their status
3. Check bounce rates and delivery issues

### Common Issues

**Emails not sending:**
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for API errors
- Ensure FROM_EMAIL is verified in Resend

**Emails going to spam:**
- Verify your domain with Resend
- Add SPF and DKIM records
- Ensure unsubscribe link is present

**Database errors:**
- Run database initialization script
- Check PostgreSQL connection
- Verify table exists: `\dt subscribers`

## Future Enhancements

Consider adding:
1. **Email preferences** - Let users choose notification frequency
2. **Email templates in database** - Allow customization without code changes
3. **Analytics** - Track open rates and click-through rates
4. **A/B testing** - Test different email designs
5. **Segment subscribers** - Send targeted content based on interests
6. **Welcome series** - Send multiple onboarding emails
7. **Re-engagement campaigns** - Win back inactive subscribers
8. **Admin dashboard** - Manage subscribers and view email stats

## Testing

### Manual Testing Checklist
- [ ] Subscribe with valid email
- [ ] Receive confirmation email
- [ ] Click unsubscribe link in email
- [ ] Complete unsubscribe process
- [ ] Try subscribing with same email (should show error)
- [ ] Create new blog post
- [ ] Verify subscribers receive notification
- [ ] Create new admin user
- [ ] Verify admin receives welcome email
- [ ] Check all email links work correctly

### Automated Testing
Consider adding tests for:
- Email validation logic
- Database operations (subscribe/unsubscribe)
- API endpoint responses
- Token generation and validation

## Support and Resources

- **Resend Documentation**: https://resend.com/docs
- **Resend Status**: https://status.resend.com/
- **Email Best Practices**: https://resend.com/guides
- **Support**: Contact Resend support through their dashboard

## Summary

The email service is fully integrated into the blog's workflow:
- ✅ Subscribers can easily sign up and unsubscribe
- ✅ Automatic notifications for new posts
- ✅ Professional welcome emails for new admins
- ✅ Beautiful, responsive email templates
- ✅ Efficient batch processing for large subscriber lists
- ✅ Complete error handling and logging

All email operations are asynchronous and don't impact user experience or API response times.
