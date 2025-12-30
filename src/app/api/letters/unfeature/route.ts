import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { unfeatureLetter } from '@/lib/database';

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

    const success = await unfeatureLetter(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unfeature letter' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Letter unfeatured successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unfeaturing letter:', error);
    return NextResponse.json(
      { error: 'Failed to unfeature letter' },
      { status: 500 }
    );
  }
}
