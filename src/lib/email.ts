import { Resend } from 'resend';

// Constants
const BATCH_SIZE = parseInt(process.env.EMAIL_BATCH_SIZE || '50', 10);
const BATCH_DELAY_MS = parseInt(process.env.EMAIL_BATCH_DELAY_MS || '1000', 10);

// Validate required environment variables
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required. Get your API key from https://resend.com/api-keys');
}

if (!process.env.FROM_EMAIL) {
  console.warn('FROM_EMAIL environment variable is not set. Using default: onboarding@resend.dev');
}

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn('NEXT_PUBLIC_SITE_URL environment variable is not set. Using default: http://localhost:3000');
}

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  email: string,
  unsubscribeToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Our Blog! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Blog</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 32px;">Welcome! 🎉</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; font-size: 24px; margin-top: 0;">Thanks for Subscribing!</h2>
              
              <p style="font-size: 16px; color: #555;">
                We're excited to have you as part of our community! You'll now receive updates whenever we publish new content.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">What to Expect:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Fresh content and insights</li>
                  <li style="margin-bottom: 10px;">Early access to new posts</li>
                  <li style="margin-bottom: 10px;">Exclusive updates from our team</li>
                </ul>
              </div>
              
              <p style="font-size: 16px; color: #555;">
                Stay tuned for our latest articles and updates!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${SITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">Visit Our Blog</a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
                <p style="margin: 5px 0;">You're receiving this email because you subscribed to our blog.</p>
                <p style="margin: 5px 0;">
                  <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                  <a href="${SITE_URL}" style="color: #667eea; text-decoration: none;">View in Browser</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send new post notification to all active subscribers
 */
export async function sendNewPostNotification(
  postTitle: string,
  postExcerpt: string,
  postSlug: string,
  postImage?: string
): Promise<{ success: boolean; error?: string; sent: number }> {
  try {
    const { getActiveSubscribers } = await import('./database');
    const subscribers = await getActiveSubscribers();

    if (subscribers.length === 0) {
      return { success: true, sent: 0 };
    }

    const postUrl = `${SITE_URL}/blog/${postSlug}`;
    let sentCount = 0;

    // Send emails in batches to avoid rate limits
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      
      const emailPromises = batch.map(subscriber => {
        const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.unsubscribe_token}`;
        
        return resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: `New Post: ${postTitle} 📝`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Blog Post</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #ffffff; padding: 0; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                  ${postImage ? `
                    <div style="width: 100%; height: 250px; overflow: hidden;">
                      <img src="${postImage}" alt="${postTitle}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                  ` : ''}
                  
                  <div style="padding: 40px 30px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold; margin-bottom: 20px;">
                      NEW POST
                    </div>
                    
                    <h1 style="color: #333; font-size: 28px; margin: 20px 0; line-height: 1.3;">
                      ${postTitle}
                    </h1>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.8;">
                      ${postExcerpt}
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                      <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">Read Full Article</a>
                    </div>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
                      <p style="margin: 5px 0;">You're receiving this because you subscribed to our blog.</p>
                      <p style="margin: 5px 0;">
                        <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                        <a href="${SITE_URL}" style="color: #667eea; text-decoration: none;">Visit Blog</a>
                      </p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      });

      await Promise.all(emailPromises);
      sentCount += batch.length;
      
      // Add a small delay between batches
      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    return { success: true, sent: sentCount };
  } catch (error) {
    console.error('Error sending new post notifications:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      sent: 0
    };
  }
}

/**
 * Send admin creation notification email
 */
export async function sendAdminCreationEmail(
  email: string,
  name: string,
  temporaryPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const loginUrl = `${SITE_URL}/admin/login`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to the Blog Admin Team! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Account Created</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 32px;">Welcome to the Team! 🎉</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; font-size: 24px; margin-top: 0;">Hello ${name}!</h2>
              
              <p style="font-size: 16px; color: #555;">
                Your admin account has been successfully created. You now have access to the blog administration panel where you can manage posts and other admin features.
              </p>
              
              <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #333; font-size: 18px;">Your Login Credentials</h3>
                <div style="margin: 15px 0;">
                  <strong style="color: #555;">Email:</strong><br>
                  <code style="background: #e8e8e8; padding: 5px 10px; border-radius: 4px; display: inline-block; margin-top: 5px;">${email}</code>
                </div>
                <div style="margin: 15px 0;">
                  <strong style="color: #555;">Temporary Password:</strong><br>
                  <code style="background: #e8e8e8; padding: 5px 10px; border-radius: 4px; display: inline-block; margin-top: 5px;">${temporaryPassword}</code>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 6px; border: 1px solid #ffc107;">
                  <strong style="color: #856404;">⚠️ Important Security Notice:</strong>
                  <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
                    Please change your password immediately after your first login for security purposes.
                  </p>
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">Admin Capabilities:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Create, edit, and delete blog posts</li>
                  <li style="margin-bottom: 10px;">Manage other admin users</li>
                  <li style="margin-bottom: 10px;">Access analytics and insights</li>
                  <li style="margin-bottom: 10px;">Manage subscriber list</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Admin Panel</a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
                <p style="margin: 5px 0;">If you didn't expect this email or believe you received it in error, please contact the blog administrator immediately.</p>
                <p style="margin: 15px 0 5px 0;">
                  <a href="${SITE_URL}" style="color: #667eea; text-decoration: none;">Visit Blog</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin creation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send unsubscribe confirmation email
 */
export async function sendUnsubscribeConfirmationEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You\'ve Been Unsubscribed',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unsubscribed</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #333; font-size: 24px; margin-top: 0;">You've Been Unsubscribed</h2>
              
              <p style="font-size: 16px; color: #555;">
                We're sorry to see you go! You've been successfully unsubscribed from our blog updates.
              </p>
              
              <p style="font-size: 16px; color: #555;">
                You will no longer receive email notifications about new blog posts.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; font-size: 15px; color: #555;">
                  <strong>Changed your mind?</strong><br>
                  You can always resubscribe by visiting our blog and entering your email address in the subscription form.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${SITE_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">Visit Our Blog</a>
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
                <p style="margin: 5px 0;">Thank you for being part of our community.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending unsubscribe confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
