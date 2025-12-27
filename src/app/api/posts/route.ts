import { NextRequest, NextResponse } from 'next/server';
import { savePost, getPost, getAllPosts } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, content' },
        { status: 400 }
      );
    }

    // Save to database
    const post = await savePost({
      id: body.id,
      title: body.title,
      excerpt: body.excerpt || '',
      content: body.content,
      author: body.author || 'Anonymous',
      tags: body.tags || [],
      image: body.image,
      read_time: body.readTime || '1 min read',
      date: body.date || new Date().toISOString(),
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
