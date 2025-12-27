import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscriberByEmail, reactivateSubscriber } from '@/lib/database';
import { sendSubscriptionConfirmationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await getSubscriberByEmail(email);
    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        const reactivatedSubscriber = await reactivateSubscriber(email);
        
        if (!reactivatedSubscriber) {
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        // Send confirmation email
        const emailResult = await sendSubscriptionConfirmationEmail(
          email,
          existingSubscriber.unsubscribe_token
        );

        if (!emailResult.success) {
          console.error('Failed to send confirmation email:', emailResult.error);
        }

        return NextResponse.json(
          {
            message: 'Welcome back! Your subscription has been reactivated. Check your email for confirmation.',
            subscriber: {
              id: reactivatedSubscriber.id,
              email: reactivatedSubscriber.email,
              subscribed_at: reactivatedSubscriber.subscribed_at,
            },
          },
          { status: 200 }
        );
      }
    }

    // Generate unique unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    // Add subscriber to database
    const subscriber = await addSubscriber(email, unsubscribeToken);

    // Send confirmation email
    const emailResult = await sendSubscriptionConfirmationEmail(
      email,
      unsubscribeToken
    );

    if (!emailResult.success) {
      console.error('Failed to send confirmation email:', emailResult.error);
      // Still return success since subscriber was added to database
    }

    return NextResponse.json(
      {
        message: 'Successfully subscribed! Check your email for confirmation.',
        subscriber: {
          id: subscriber.id,
          email: subscriber.email,
          subscribed_at: subscriber.subscribed_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to subscribe to the blog' },
    { status: 405 }
  );
}
