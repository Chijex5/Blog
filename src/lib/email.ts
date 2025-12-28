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

const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@chijioke.app';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const BRAND_NAME = "Chijioke's Blog";

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
      from: `"Chijioke’s Blog" <${FROM_EMAIL}>`,
      to: [email],
      subject: `Welcome to ${BRAND_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${BRAND_NAME}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f2f0;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 60px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
                    
                    <!-- Header with subtle badge -->
                    <tr>
                      <td style="padding: 60px 60px 40px 60px; text-align: center;">
                        <div style="display: inline-block; background-color: #ede8e6; color: #000000; font-size: 11px; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 32px;">
                          From the desk of Chijioke
                        </div>
                      </td>
                    </tr>

                    <!-- Main heading -->
                    <tr>
                      <td style="padding: 0 60px 40px 60px; text-align: center;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 500; color: #000000; line-height: 1.3; letter-spacing: -0.5px;">
                          Thanks for subscribing
                        </h1>
                      </td>
                    </tr>

                    <!-- Body content -->
                    <tr>
                      <td style="padding: 0 60px 50px 60px;">
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #333333;">
                          You'll now receive updates whenever I publish new ideas and insights for modern creators.
                        </p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #333333;">
                          I write about building, creating, and earning on your own terms — no spam, just thoughtful content delivered to your inbox.
                        </p>
                      </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                      <td style="padding: 0 60px 60px 60px; text-align: center;">
                        <a href="${SITE_URL}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; letter-spacing: 0.3px;">
                          Visit the Blog
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 40px 60px 60px 60px; border-top: 1px solid #ede8e6;">
                        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #6b6b6b; text-align: center;">
                          © 2025 ${BRAND_NAME}. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #999999; text-align: center;">
                          <a href="${unsubscribeUrl}" style="color: #6b6b6b; text-decoration: none;">Unsubscribe</a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
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
          from: `"Chijioke’s Blog" <${FROM_EMAIL}>`,
      to: [subscriber.email],
          subject: `New from ${BRAND_NAME}: ${postTitle}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Blog Post</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f2f0;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 60px 20px;">
                      <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
                        
                        ${postImage ? `
                        <!-- Hero Image -->
                        <tr>
                          <td style="padding: 0;">
                            <img src="${postImage}" alt="${postTitle}" style="width: 100%; height: auto; display: block; max-height: 320px; object-fit: cover;">
                          </td>
                        </tr>
                        ` : ''}

                        <!-- Badge -->
                        <tr>
                          <td style="padding: ${postImage ? '50px' : '60px'} 60px 30px 60px;">
                            <div style="display: inline-block; background-color: #ede8e6; color: #000000; font-size: 11px; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase;">
                              New Article
                            </div>
                          </td>
                        </tr>

                        <!-- Title -->
                        <tr>
                          <td style="padding: 0 60px 30px 60px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 500; color: #000000; line-height: 1.3; letter-spacing: -0.5px;">
                              ${postTitle}
                            </h1>
                          </td>
                        </tr>

                        <!-- Excerpt -->
                        <tr>
                          <td style="padding: 0 60px 40px 60px;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #333333;">
                              ${postExcerpt}
                            </p>
                          </td>
                        </tr>

                        <!-- CTA -->
                        <tr>
                          <td style="padding: 0 60px 60px 60px;">
                            <a href="${postUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; letter-spacing: 0.3px;">
                              Read Article
                            </a>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 40px 60px 60px 60px; border-top: 1px solid #ede8e6;">
                            <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #6b6b6b; text-align: center;">
                              © 2025 ${BRAND_NAME}. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #999999; text-align: center;">
                              <a href="${unsubscribeUrl}" style="color: #6b6b6b; text-decoration: none;">Unsubscribe</a>
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
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
      from: `"Chijioke’s Blog" <${FROM_EMAIL}>`,
      to: [email],
      subject: `Admin Access Granted — ${BRAND_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Account Created</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f2f0;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 60px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 60px 60px 40px 60px;">
                        <div style="display: inline-block; background-color: #ede8e6; color: #000000; font-size: 11px; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 32px;">
                          Admin Access
                        </div>
                        <h1 style="margin: 0; font-size: 32px; font-weight: 500; color: #000000; line-height: 1.3; letter-spacing: -0.5px;">
                          Welcome, ${name}
                        </h1>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding: 0 60px 40px 60px;">
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #333333;">
                          Your admin account has been created for ${BRAND_NAME}. You now have access to manage posts, users, and subscribers.
                        </p>
                      </td>
                    </tr>

                    <!-- Credentials Box -->
                    <tr>
                      <td style="padding: 0 60px 40px 60px;">
                        <div style="background-color: #f5f2f0; padding: 32px; border-radius: 8px;">
                          <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #000000;">
                            Login Credentials
                          </h3>
                          
                          <div style="margin-bottom: 16px;">
                            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.5px;">
                              Email
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #000000; font-family: 'Courier New', monospace;">
                              ${email}
                            </p>
                          </div>

                          <div style="margin-bottom: 24px;">
                            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 500; color: #6b6b6b; text-transform: uppercase; letter-spacing: 0.5px;">
                              Temporary Password
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #000000; font-family: 'Courier New', monospace;">
                              ${temporaryPassword}
                            </p>
                          </div>

                          <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border-left: 3px solid #000000;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;">
                              <strong>Security Notice:</strong> Please change your password immediately after logging in.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!-- Capabilities -->
                    <tr>
                      <td style="padding: 0 60px 50px 60px;">
                        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 500; color: #000000;">
                          Your Capabilities
                        </h3>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                          <li style="margin-bottom: 12px; padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #333333;">
                            <span style="position: absolute; left: 0; top: 0;">•</span>
                            Create, edit, and publish blog posts
                          </li>
                          <li style="margin-bottom: 12px; padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #333333;">
                            <span style="position: absolute; left: 0; top: 0;">•</span>
                            Manage admin users and permissions
                          </li>
                          <li style="margin-bottom: 12px; padding-left: 24px; position: relative; font-size: 15px; line-height: 1.6; color: #333333;">
                            <span style="position: absolute; left: 0; top: 0;">•</span>
                            View analytics and subscriber lists
                          </li>
                        </ul>
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td style="padding: 0 60px 60px 60px;">
                        <a href="${loginUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; letter-spacing: 0.3px;">
                          Access Admin Panel
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 40px 60px 60px 60px; border-top: 1px solid #ede8e6;">
                        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #6b6b6b; text-align: center;">
                          If you didn't expect this email, please contact the blog administrator.
                        </p>
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #999999; text-align: center;">
                          © 2025 ${BRAND_NAME}. All rights reserved.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
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
      from: `"Chijioke’s Blog" <${FROM_EMAIL}>`,
      to: [email],
      subject: `Unsubscribed from ${BRAND_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unsubscribed</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f2f0;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 60px 20px;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 60px 60px 40px 60px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 500; color: #000000; line-height: 1.3; letter-spacing: -0.5px;">
                          You've been unsubscribed
                        </h1>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding: 0 60px 40px 60px; text-align: center;">
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #333333;">
                          You will no longer receive email notifications about new posts from ${BRAND_NAME}.
                        </p>
                        
                        <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #333333;">
                          We're sorry to see you go, but we understand.
                        </p>
                      </td>
                    </tr>

                    <!-- Resubscribe info -->
                    <tr>
                      <td style="padding: 0 60px 50px 60px;">
                        <div style="background-color: #f5f2f0; padding: 32px; border-radius: 8px; text-align: center;">
                          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333333;">
                            <strong>Changed your mind?</strong><br>
                            You can resubscribe anytime by visiting the blog and entering your email in the subscription form.
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td style="padding: 0 60px 60px 60px; text-align: center;">
                        <a href="${SITE_URL}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; letter-spacing: 0.3px;">
                          Visit Blog
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 40px 60px 60px 60px; border-top: 1px solid #ede8e6;">
                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b6b6b; text-align: center;">
                          Thank you for being part of our community.
                        </p>
                        <p style="margin: 12px 0 0 0; font-size: 13px; line-height: 1.6; color: #999999; text-align: center;">
                          © 2025 ${BRAND_NAME}. All rights reserved.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
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
