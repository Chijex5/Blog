/**
 * Migration script to add comments table
 * 
 * This script can be run safely multiple times - it checks if the table already exists
 * before attempting to create it.
 * 
 * Usage: node scripts/migrate-add-comments.js
 */

require('dotenv').config();
const { Pool } = require('pg');

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
    console.log('Starting migration: Adding comments table...');
    
    // Check if the table already exists
    const checkTable = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'comments'
    `);
    
    if (checkTable.rows.length > 0) {
      console.log('✓ Comments table already exists. Skipping migration.');
    } else {
      // Create the comments table
      await client.query(`
        CREATE TABLE comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id VARCHAR(255) NOT NULL,
          author_name VARCHAR(255) NOT NULL,
          author_email VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_deleted BOOLEAN DEFAULT false,
          FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
        );
      `);
      
      console.log('✓ Created comments table');
      
      // Create indexes for better query performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
      `);
      
      console.log('✓ Created index on post_id column');
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
      `);
      
      console.log('✓ Created index on created_at column');
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_comments_deleted ON comments(is_deleted);
      `);
      
      console.log('✓ Created index on is_deleted column');
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
