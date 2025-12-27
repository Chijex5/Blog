import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import bcrypt from 'bcryptjs';
import pool from '@/lib/database';
import { sendAdminCreationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can add new admins' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, password } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, password' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 12 characters)
    if (password.length < 12) {
      return NextResponse.json(
        { error: 'Password must be at least 12 characters long' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert new admin user
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id, email, name, role, created_at`,
        [email, passwordHash, name.trim(), 'admin', true]
      );

      const newUser = result.rows[0];

      // Send welcome email to the new admin (asynchronously)
      sendAdminCreationEmail(email, name.trim(), password)
        .then(result => {
          if (result.success) {
            console.log(`Welcome email sent to new admin: ${email}`);
          } else {
            console.error(`Failed to send welcome email to ${email}:`, result.error);
          }
        })
        .catch(error => {
          console.error('Error sending admin creation email:', error);
        });

      return NextResponse.json(
        {
          message: 'Admin user created successfully',
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            created_at: newUser.created_at,
          },
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
