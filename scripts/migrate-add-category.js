/**
 * Migration script to add category column to existing blog_posts table
 * 
 * This script can be run safely multiple times - it checks if the column already exists
 * before attempting to add it.
 * 
 * Usage: node scripts/migrate-add-category.js
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
    console.log('Starting migration: Adding category column...');
    
    // Check if the column already exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND column_name = 'category'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('✓ Column category already exists. Skipping migration.');
    } else {
      // Add the category column
      await client.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN category VARCHAR(100);
      `);
      
      console.log('✓ Added category column to blog_posts table');
      
      // Create index for better query performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
      `);
      
      console.log('✓ Created index on category column');
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
