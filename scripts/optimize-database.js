#!/usr/bin/env node

/**
 * Database Optimization Migration Script
 * 
 * This script adds performance-optimizing indexes to the blog_posts table
 * to improve query performance for common operations.
 * 
 * Optimizations:
 * 1. Index on author column for filtering posts by author
 * 2. Composite index on (is_deleted, date) for active posts queries
 * 3. Index on created_by for "my posts" filtering
 * 4. Ensure all recommended indexes exist
 * 
 * Usage: node scripts/optimize-database.js
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function optimizeDatabase() {
  console.log('='.repeat(60));
  console.log('Database Optimization Script');
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
    console.log('Starting database optimization...');
    console.log();

    // 1. Add index on author column
    console.log('1. Adding index on author column...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_author 
      ON blog_posts(author) 
      WHERE is_deleted = false;
    `);
    console.log('   ✓ Author index created');

    // 2. Add composite index for active posts queries
    console.log('2. Adding composite index for active posts...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_active_date 
      ON blog_posts(is_deleted, date DESC) 
      WHERE is_deleted = false;
    `);
    console.log('   ✓ Active posts index created');

    // 3. Add index for created_by filtering
    console.log('3. Adding index for post ownership filtering...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_created_by 
      ON blog_posts(created_by, date DESC) 
      WHERE is_deleted = false;
    `);
    console.log('   ✓ Created by index created');

    // 4. Verify existing important indexes
    console.log('4. Verifying existing indexes...');
    const indexCheck = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'blog_posts'
      ORDER BY indexname;
    `);
    
    console.log('   Existing indexes on blog_posts:');
    indexCheck.rows.forEach(row => {
      console.log(`   - ${row.indexname}`);
    });

    // 5. Analyze table for query planner
    console.log('5. Analyzing table for query optimization...');
    await client.query('ANALYZE blog_posts;');
    console.log('   ✓ Table analyzed');

    console.log();
    console.log('='.repeat(60));
    console.log('Database optimization completed successfully!');
    console.log('='.repeat(60));
    console.log();
    console.log('Performance improvements:');
    console.log('  • Faster author filtering');
    console.log('  • Faster dashboard queries');
    console.log('  • Faster "my posts" queries');
    console.log('  • Optimized query plans');
    console.log();

  } catch (error) {
    console.error();
    console.error('Optimization failed:', error);
    console.error();
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run optimization
optimizeDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
