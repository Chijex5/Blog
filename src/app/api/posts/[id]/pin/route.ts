import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pinPost, unpinPost, getPostIncludingDeleted } from '@/lib/database';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    
    // Get the post to check if it exists and is not deleted
    const post = await getPostIncludingDeleted(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    if (post.is_deleted) {
      return NextResponse.json(
        { error: 'Cannot pin a deleted post' },
        { status: 400 }
      );
    }

    // Pin the post (this will unpin any other pinned post)
    const success = await pinPost(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to pin post' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Post pinned successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error pinning post:', error);
    return NextResponse.json(
      { error: 'Failed to pin post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Unpin the post
    const success = await unpinPost(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to unpin post' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Post unpinned successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unpinning post:', error);
    return NextResponse.json(
      { error: 'Failed to unpin post' },
      { status: 500 }
    );
  }
}
