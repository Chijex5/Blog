import { Letter } from "@/lib/database";
import { getAllLetters, getLetterBySlug } from '@/lib/database';

/**
 * Parse content - handles both HTML strings and TipTap JSON
 */
function parseContent(content: any): any {
  if (!content) {
    return { type: 'doc', content: [] };
  }
  
  // If it's already an object, return it
  if (typeof content === 'object' && content.type) {
    return content;
  }
  
  // If it's a string, try to parse as JSON
  if (typeof content === 'string') {
    // Check if it's HTML (starts with < tag)
    if (content.trim().startsWith('<')) {
      // Convert HTML to simple TipTap format
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content.replace(/<[^>]*>/g, '') // Strip HTML tags for now
              }
            ]
          }
        ]
      };
    }
    
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // If parsing fails, treat as plain text
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: content
              }
            ]
          }
        ]
      };
    }
  }
  
  return content;
}

/**
 * Get all letters from database
 */
export async function getLetters(): Promise<Letter[]> {
  try {
    const dbLetters = await getAllLetters();
    
    if (dbLetters && dbLetters.length > 0) {
      // Convert database letters to Letter format
      return dbLetters.map(letter => ({
        id: letter.id,
        letter_number: letter.letter_number,
        title: letter.title,
        subtitle: letter.subtitle,
        recipient: letter.recipient,
        content: parseContent(letter.content),
        excerpt: letter.excerpt,
        author: letter.author,
        slug: letter.slug,
        image: letter.image,
        read_time: letter.read_time,
        published_date: typeof letter.published_date === 'string' 
          ? letter.published_date 
          : (letter.published_date as Date).toISOString(),
        created_at: letter.created_at,
        updated_at: letter.updated_at,
        created_by: letter.created_by,
        updated_by: letter.updated_by,
        is_deleted: letter.is_deleted,
        is_featured: letter.is_featured,
        series: letter.series,
        tags: letter.tags,
        views: letter.views,
        shares: letter.shares,
      }));
    }
  } catch (error) {
    console.error('Error fetching letters from database:', error);
  }
  
  // Return empty array if no letters
  return [];
}

/**
 * Get a single letter by slug from database
 */
export async function getLetter(slug: string): Promise<Letter | undefined> {
  try {
    const dbLetter = await getLetterBySlug(slug);
    
    if (dbLetter) {
      // Convert database letter to Letter format
      return {
        id: dbLetter.id,
        letter_number: dbLetter.letter_number,
        title: dbLetter.title,
        subtitle: dbLetter.subtitle,
        recipient: dbLetter.recipient,
        content: parseContent(dbLetter.content),
        excerpt: dbLetter.excerpt,
        author: dbLetter.author,
        slug: dbLetter.slug,
        image: dbLetter.image,
        read_time: dbLetter.read_time,
        published_date: typeof dbLetter.published_date === 'string' 
          ? dbLetter.published_date 
          : (dbLetter.published_date as Date).toISOString(),
        created_at: dbLetter.created_at,
        updated_at: dbLetter.updated_at,
        created_by: dbLetter.created_by,
        updated_by: dbLetter.updated_by,
        is_deleted: dbLetter.is_deleted,
        is_featured: dbLetter.is_featured,
        series: dbLetter.series,
        tags: dbLetter.tags,
        views: dbLetter.views,
        shares: dbLetter.shares,
      };
    }
  } catch (error) {
    console.error(`Error fetching letter with slug ${slug} from database:`, error);
  }
  
  return undefined;
}
