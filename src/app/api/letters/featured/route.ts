import { NextResponse } from 'next/server';
import { getFeaturedLetter } from '@/lib/database';

export async function GET() {
  try {
    const featuredLetter = await getFeaturedLetter();
    
    if (!featuredLetter) {
      return NextResponse.json(
        { message: 'No featured letter available' },
        { status: 404 }
      );
    }

    return NextResponse.json(featuredLetter, { status: 200 });
  } catch (error) {
    console.error('Error fetching featured letter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured letter' },
      { status: 500 }
    );
  }
}
