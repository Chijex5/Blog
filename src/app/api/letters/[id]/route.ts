import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getLetterIncludingDeleted, deleteLetter } from '@/lib/database';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
     const { id } = await context.params;
    const letter = await getLetterIncludingDeleted(id);
    
    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    console.error('Error fetching letter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch letter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = await context.params;
    const success = await deleteLetter(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Letter not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Letter deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting letter:', error);
    return NextResponse.json(
      { error: 'Failed to delete letter' },
      { status: 500 }
    );
  }
}
