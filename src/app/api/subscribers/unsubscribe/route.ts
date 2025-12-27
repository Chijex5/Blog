import { NextRequest, NextResponse } from 'next/server';
import { getSubscriberByToken, unsubscribeByToken } from '@/lib/database';
import { sendUnsubscribeConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    // Check if subscriber exists
    const subscriber = await getSubscriberByToken(token);
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { message: 'You are already unsubscribed' },
        { status: 200 }
      );
    }

    // Unsubscribe
    await unsubscribeByToken(token);

    // Send confirmation email
    const emailResult = await sendUnsubscribeConfirmationEmail(subscriber.email);
    if (!emailResult.success) {
      console.error('Failed to send unsubscribe confirmation email:', emailResult.error);
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed from blog updates' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    // Check if subscriber exists
    const subscriber = await getSubscriberByToken(token);
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        email: subscriber.email,
        is_active: subscriber.is_active 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching unsubscribe info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unsubscribe information' },
      { status: 500 }
    );
  }
}
