import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getAllSubscribers } from '@/lib/database';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const subscribers = await getAllSubscribers();
    
    return NextResponse.json({
      subscribers,
      total: subscribers.length,
      active: subscribers.filter(s => s.is_active).length,
      inactive: subscribers.filter(s => !s.is_active).length,
    });
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to get subscribers' },
      { status: 500 }
    );
  }
}
