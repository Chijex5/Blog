import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { savePost, getPost, getAllPosts } from '@/lib/database';
import { slugify } from '@/lib/slug';
import { sendNewPostNotification } from '@/lib/email';

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

    const isNewPost = !body.id;

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

    // Send email notifications to subscribers for new posts
    // Only send if it's a new post and sendNotification is not explicitly set to false
    if (isNewPost && body.sendNotification !== false) {
      // Send notifications asynchronously (don't wait for completion)
      sendNewPostNotification(
        post.title,
        post.excerpt,
        post.slug,
        post.image
      ).then(result => {
        if (result.success) {
          console.log(`Successfully sent notifications to ${result.sent} subscribers`);
        } else {
          console.error('Failed to send post notifications:', result.error);
        }
      }).catch(error => {
        console.error('Error sending post notifications:', error);
      });
    }

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
