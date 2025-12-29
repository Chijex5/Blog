import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { featureLetter } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Letter ID is required' },
        { status: 400 }
      );
    }

    const success = await featureLetter(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to feature letter' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Letter featured successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error featuring letter:', error);
    return NextResponse.json(
      { error: 'Failed to feature letter' },
      { status: 500 }
    );
  }
}
