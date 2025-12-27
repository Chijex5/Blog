import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { savePost, getPost, getAllPosts } from '@/lib/database';
import { slugify } from '@/lib/slug';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields (id is optional for new posts)
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content' },
        { status: 400 }
      );
    }

    const slug = slugify(body.title);
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid title for slug generation' },
        { status: 400 }
      );
    }

    // Save to database (UUID will be generated server-side if id is not provided)
    const post = await savePost({
      id: body.id, // Will be undefined for new posts, causing server to generate UUID
      title: body.title,
      excerpt: body.excerpt || '',
      slug: slug,
      content: body.content,
      author: body.author || 'Anonymous',
      tags: body.tags || [],
      image: body.image,
      read_time: body.readTime || '1 min read',
      date: body.date || new Date().toISOString(),
      created_by: session.user.id, // Track who created/updated
      updated_by: session.user.id,
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single post
      const post = await getPost(id);
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(post);
    } else {
      // Get all posts
      const posts = await getAllPosts();
      return NextResponse.json(posts);
    }
  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json(
      { error: 'Failed to get posts' },
      { status: 500 }
    );
  }
}
