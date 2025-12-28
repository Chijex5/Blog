/**
 * Migration script to add is_deleted column to existing blog_posts table
 * 
 * This script can be run safely multiple times - it checks if the column already exists
 * before attempting to add it.
 * 
 * Usage: node scripts/migrate-add-is-deleted.js
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
    console.log('Starting migration: Adding is_deleted column...');
    
    // Check if the column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND column_name = 'is_deleted'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✓ Column is_deleted already exists. Skipping migration.');
    } else {
      // Add the is_deleted column with default value false
      await client.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN is_deleted BOOLEAN DEFAULT false;
      `);
      
      console.log('✓ Added is_deleted column to blog_posts table');
      
      // Create indexes for better query performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted ON blog_posts(is_deleted);
      `);
      
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_blog_posts_id_deleted ON blog_posts(id, is_deleted);
      `);
      
      console.log('✓ Created indexes on is_deleted column');
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
