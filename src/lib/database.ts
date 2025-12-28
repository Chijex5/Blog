import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Get SSL CA if available
let sslCa: string | undefined;
try {
  const caPath = path.join(process.cwd(), 'ca.pem');
  if (fs.existsSync(caPath)) {
    sslCa = fs.readFileSync(caPath, "utf8");
  }
} catch (error) {
  // CA file not available, will use environment variable if set
}

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DATABASE_USER || "",
  password: process.env.DATABASE_PASSWORD || "",
  host: process.env.DATABASE_HOST || "",
  port: Number(process.env.DATABASE_PORT) || 0,
  database: process.env.DATABASE_NAME || "",
  ssl: process.env.DATABASE_HOST ? { 
    rejectUnauthorized: false,
    ca: process.env.DATABASE_SSL_CA || sslCa,
  } : false,
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
  slug: string;
  date: string;
  created_at: Date;
  created_by?: string;
  updated_by?: string;
  updated_at: Date;
  is_deleted?: boolean;
  is_pinned?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed_at: Date;
  unsubscribe_token: string;
  is_active: boolean;
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false,
        is_pinned BOOLEAN DEFAULT false
      );
      
      CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted ON blog_posts(is_deleted);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_id_deleted ON blog_posts(id, is_deleted);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_pinned ON blog_posts(is_pinned) WHERE is_pinned = true;

      CREATE TABLE IF NOT EXISTS subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribe_token VARCHAR(255) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true
      );

      CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
      CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers(unsubscribe_token);
      CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(is_active);
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  const client = await pool.connect();
  const result = await client.query<{ exists: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM posts WHERE slug = $1) as exists',
    [slug]
  );
  return result.rows[0]?.exists || false;
}

/**
 * Save or update a blog post
 */
export async function savePost(post: Omit<BlogPost, 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const client = await pool.connect();
  try {
    // If id is provided, try to update first
    if (post.id) {
      const updateResult = await client.query(
        `UPDATE blog_posts SET
          title = $1,
          excerpt = $2,
          content = $3,
          author = $4,
          slug = $5,
          tags = $6,
          image = $7,
          read_time = $8,
          date = $9,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = $10
        WHERE id = $11
        RETURNING *;`,
        [
          post.title,
          post.excerpt,
          post.content,
          post.author,
          post.slug,
          post.tags,
          post.image,
          post.read_time,
          post.date,
          post.updated_by,
          post.id
        ]
      );
      
      if (updateResult.rows.length > 0) {
        return updateResult.rows[0];
      } else {
        console.warn(`Update failed: Post with id ${post.id} not found`);
      }
    }
    
    // If no id provided or update didn't find a row, insert new post
    const result = await client.query(
      `INSERT INTO blog_posts (
        title,
        excerpt,
        content,
        author,
        tags,
        image,
        read_time,
        date,
        slug,
        created_by,
        updated_by
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11
      )
      RETURNING *;`,
      [
        post.title,      // $1
        post.excerpt,    // $2
        post.content,    // $3
        post.author,     // $4
        post.tags,       // $5
        post.image,      // $6
        post.read_time,  // $7
        post.date,       // $8
        post.slug,       // $9
        post.created_by, // $10 created_by
        post.updated_by  // $11 updated_by
      ]
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
 * Get a single blog post by ID (excludes deleted posts for public view)
 */
export async function getPost(id: string): Promise<BlogPost | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE id = $1 AND is_deleted = false',
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
 * Get a single blog post by ID including deleted ones (for admin view)
 */
export async function getPostIncludingDeleted(id: string): Promise<BlogPost | null> {
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
 * Get a single blog post by slug (excludes deleted posts for public view)
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND is_deleted = false',
      [slug]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a single blog post by slug including deleted ones (for admin view)
 */
export async function getPostBySlugIncludingDeleted(slug: string): Promise<BlogPost | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE slug = $1',
      [slug]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get all blog posts (excludes deleted posts by default for public view)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE is_deleted = false ORDER BY date DESC'
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
 * Get all blog posts including deleted ones (for admin view)
 */
export async function getAllPostsIncludingDeleted(): Promise<BlogPost[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts ORDER BY date DESC'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Soft delete a blog post (marks as deleted instead of removing)
 */
export async function deletePost(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE blog_posts SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
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

/**
 * Add a new subscriber
 */
export async function addSubscriber(email: string, unsubscribeToken: string): Promise<Subscriber> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO subscribers (email, unsubscribe_token)
       VALUES ($1, $2)
       RETURNING *`,
      [email.toLowerCase(), unsubscribeToken]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get subscriber by email
 */
export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM subscribers WHERE email = $1',
      [email.toLowerCase()]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting subscriber:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get subscriber by unsubscribe token
 */
export async function getSubscriberByToken(token: string): Promise<Subscriber | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM subscribers WHERE unsubscribe_token = $1',
      [token]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting subscriber by token:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Unsubscribe a subscriber by token
 */
export async function unsubscribeByToken(token: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE subscribers SET is_active = false WHERE unsubscribe_token = $1',
      [token]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Reactivate a subscriber by email
 */
export async function reactivateSubscriber(email: string): Promise<Subscriber | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE subscribers SET is_active = true, subscribed_at = CURRENT_TIMESTAMP WHERE email = $1 RETURNING *',
      [email.toLowerCase()]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error reactivating subscriber:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get all active subscribers
 */
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM subscribers WHERE is_active = true ORDER BY subscribed_at DESC'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting active subscribers:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get all subscribers (active and inactive)
 */
export async function getAllSubscribers(): Promise<Subscriber[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM subscribers ORDER BY subscribed_at DESC'
    );
    
    return result.rows;
  } catch (error) {
    console.error('Error getting all subscribers:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get the pinned post (if any)
 */
export async function getPinnedPost(): Promise<BlogPost | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM blog_posts WHERE is_pinned = true AND is_deleted = false LIMIT 1'
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting pinned post:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Pin a post (unpins any other pinned post)
 */
export async function pinPost(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Unpin all posts only if there are any pinned posts
    await client.query('UPDATE blog_posts SET is_pinned = false WHERE is_pinned = true AND id != $1', [id]);
    
    // Pin the specified post
    const result = await client.query(
      'UPDATE blog_posts SET is_pinned = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_deleted = false',
      [id]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error pinning post:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Unpin a post
 */
export async function unpinPost(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE blog_posts SET is_pinned = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error unpinning post:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
