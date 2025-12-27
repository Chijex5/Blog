#!/usr/bin/env node

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function seedAdmin() {
  console.log('='.repeat(60));
  console.log('Admin User Creation Script');
  console.log('='.repeat(60));
  console.log();

  // Get database connection details
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

  try {
    // Prompt for user details
    const email = await question('Admin Email: ');
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }

    const name = await question('Admin Name: ');
    if (!name || name.trim().length === 0) {
      throw new Error('Name is required');
    }

    const password = await question('Admin Password (min 12 characters): ');
    if (!password || password.length < 12) {
      throw new Error('Password must be at least 12 characters');
    }

    const confirmPassword = await question('Confirm Password: ');
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    console.log();
    console.log('Creating admin user...');

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, name, role`,
      [email, passwordHash, name.trim(), 'admin', true]
    );

    const user = result.rows[0];

    console.log();
    console.log('✓ Admin user created successfully!');
    console.log();
    console.log('User Details:');
    console.log('-'.repeat(40));
    console.log(`ID:    ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name:  ${user.name}`);
    console.log(`Role:  ${user.role}`);
    console.log('-'.repeat(40));
    console.log();
    console.log('You can now log in at: /admin/login');
    console.log();

  } catch (error) {
    console.error();
    console.error('Error:', error.message);
    console.error();
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

// Run the script
seedAdmin().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
