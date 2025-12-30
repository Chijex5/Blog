#!/usr/bin/env node

/**
 * Migration script to add letters table for the Letters feature
 * 
 * This script creates the letters table for storing personal letters to students.
 * Letters are more intimate, personal content compared to blog posts.
 * 
 * Usage: node scripts/migrate-add-letters.js
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function migrate() {
  console.log('='.repeat(60));
  console.log('Letters Table Migration Script');
  console.log('='.repeat(60));
  console.log();

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
    console.log('Starting migration: Creating letters table...');
    console.log();

    // Check if the table already exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'letters'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('✓ Letters table already exists. Skipping migration.');
    } else {
      // Create the letters table
      await client.query(`
        CREATE TABLE letters (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          letter_number INTEGER UNIQUE NOT NULL,
          title VARCHAR(500) NOT NULL,
          subtitle VARCHAR(500),
          recipient VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          slug VARCHAR(500) UNIQUE NOT NULL,
          image VARCHAR(1000),
          read_time VARCHAR(50),
          published_date TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255),
          updated_by VARCHAR(255),
          is_deleted BOOLEAN DEFAULT false,
          is_featured BOOLEAN DEFAULT false,
          series VARCHAR(100),
          tags TEXT[] DEFAULT '{}',
          views INTEGER DEFAULT 0,
          shares INTEGER DEFAULT 0
        );
      `);
      
      console.log('✓ Created letters table');

      // Create indexes for better query performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_letters_number ON letters(letter_number DESC);
        CREATE INDEX IF NOT EXISTS idx_letters_date ON letters(published_date DESC);
        CREATE INDEX IF NOT EXISTS idx_letters_deleted ON letters(is_deleted);
        CREATE INDEX IF NOT EXISTS idx_letters_featured ON letters(is_featured) WHERE is_featured = true;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_letters_slug ON letters(slug);
        CREATE INDEX IF NOT EXISTS idx_letters_series ON letters(series);
        CREATE INDEX IF NOT EXISTS idx_letters_tags ON letters USING GIN(tags);
      `);
      
      console.log('✓ Created indexes on letters table');
    }
    
    console.log();
    console.log('='.repeat(60));
    console.log('Migration completed successfully!');
    console.log('='.repeat(60));
    console.log();
    console.log('Next steps:');
    console.log('  1. Letters table is ready for use');
    console.log('  2. Start creating letters via admin dashboard');
    console.log('  3. Letters will be accessible at /letters');
    console.log();

  } catch (error) {
    console.error();
    console.error('Migration failed:', error);
    console.error();
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
    console.error('Fatal error:', error);
    process.exit(1);
  });
