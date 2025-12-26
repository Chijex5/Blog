import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  image?: string;
  read_time: string;
  date: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Initialize database tables
 */
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        tags TEXT[] DEFAULT '{}',
        image VARCHAR(1000),
        read_time VARCHAR(50) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save or update a blog post
 */
export async function savePost(post: Omit<BlogPost, 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO blog_posts (id, title, excerpt, content, author, tags, image, read_time, date, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
       ON CONFLICT (id) 
       DO UPDATE SET 
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         author = EXCLUDED.author,
         tags = EXCLUDED.tags,
         image = EXCLUDED.image,
         read_time = EXCLUDED.read_time,
         date = EXCLUDED.date,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [post.id, post.title, post.excerpt, post.content, post.author, post.tags, post.image, post.read_time, post.date]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a single blog post by ID
 */
export async function getPost(id: string): Promise<BlogPost | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts ORDER BY date DESC'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM blog_posts WHERE id = $1',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
