import { NextResponse } from 'next/server';
import { getPinnedPost } from '@/lib/database';

export async function GET() {
  try {
    const pinnedPost = await getPinnedPost();
    
    if (!pinnedPost) {
      return NextResponse.json(
        { message: 'No pinned post found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pinnedPost);
  } catch (error) {
    console.error('Error getting pinned post:', error);
    return NextResponse.json(
      { error: 'Failed to get pinned post' },
      { status: 500 }
    );
  }
}
