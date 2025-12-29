import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getAllLetters, getAllLettersIncludingDeleted, saveLetter } from '@/lib/database';
import { slugify } from '@/lib/slug';

export async function GET(request: NextRequest) {
  try {
    // Check if requesting all letters including deleted (admin view)
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';
    
    if (includeDeleted && (!session || !session.user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch letters
    const letters = includeDeleted 
      ? await getAllLettersIncludingDeleted()
      : await getAllLetters();
    
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error('Error fetching letters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch letters' },
      { status: 500 }
    );
  }
}

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
    
    // Validate required fields
    if (!body.title || !body.content || !body.recipient || !body.letter_number) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, recipient, letter_number' },
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

    // Save to database
    const letter = await saveLetter({
      id: body.id, // Will be undefined for new letters, causing server to generate UUID
      letter_number: body.letter_number,
      title: body.title,
      subtitle: body.subtitle,
      recipient: body.recipient,
      excerpt: body.excerpt || '',
      slug: slug,
      content: body.content,
      author: body.author || session.user.name || 'Anonymous',
      tags: body.tags || [],
      image: body.image,
      read_time: body.readTime || '3 min read',
      published_date: body.published_date || new Date().toISOString(),
      series: body.series,
      created_by: session.user.id,
      updated_by: session.user.id,
    });

    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    console.error('Error saving letter:', error);
    return NextResponse.json(
      { error: 'Failed to save letter' },
      { status: 500 }
    );
  }
}
