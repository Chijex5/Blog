/**
 * Migration script to add slug column to existing blog_posts table
 * and generate slugs for existing posts
 * 
 * This script can be run safely multiple times - it checks if the column already exists
 * before attempting to add it.
 * 
 * Usage: node scripts/migrate-add-slug.js
 */

require('dotenv').config();
const { Pool } = require('pg');

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

async function migrate() {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    ssl: process.env.DATABASE_HOST ? {
      rejectUnauthorized: false,
    } : false,
  });

  const client = await pool.connect();
  
  try {
    console.log('Starting migration: Adding slug column...');
    
    // Check if the column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND column_name = 'slug'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✓ Column slug already exists.');
      
      // Check for posts with missing or empty slugs
      const postsWithoutSlug = await client.query(`
        SELECT id, title 
        FROM blog_posts 
        WHERE slug IS NULL OR slug = ''
      `);
      
      if (postsWithoutSlug.rows.length > 0) {
        console.log(`Found ${postsWithoutSlug.rows.length} posts without slugs. Generating slugs...`);
        
        for (const post of postsWithoutSlug.rows) {
          const slug = slugify(post.title);
          await client.query(
            'UPDATE blog_posts SET slug = $1 WHERE id = $2',
            [slug, post.id]
          );
          console.log(`  - Generated slug "${slug}" for post: ${post.title}`);
        }
        
        console.log('✓ Generated slugs for existing posts');
      } else {
        console.log('✓ All posts already have slugs');
      }
    } else {
      // Add the slug column (initially allow NULL)
      await client.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN slug VARCHAR(500);
      `);
      
      console.log('✓ Added slug column to blog_posts table');
      
      // Get all existing posts and generate slugs
      const posts = await client.query('SELECT id, title FROM blog_posts');
      
      if (posts.rows.length > 0) {
        console.log(`Generating slugs for ${posts.rows.length} existing posts...`);
        
        for (const post of posts.rows) {
          const slug = slugify(post.title);
          await client.query(
            'UPDATE blog_posts SET slug = $1 WHERE id = $2',
            [slug, post.id]
          );
          console.log(`  - Generated slug "${slug}" for post: ${post.title}`);
        }
        
        console.log('✓ Generated slugs for all existing posts');
      }
      
      // Now make the column NOT NULL since all posts have slugs
      await client.query(`
        ALTER TABLE blog_posts 
        ALTER COLUMN slug SET NOT NULL;
      `);
      
      console.log('✓ Made slug column NOT NULL');
      
      // Create unique index for better query performance and ensure uniqueness
      await client.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      `);
      
      console.log('✓ Created unique index on slug column');
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
