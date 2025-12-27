# Authentication Setup Guide

This guide will help you set up authentication for the blog admin system.

## Prerequisites

- PostgreSQL database with the required schema (see below)
- Node.js installed
- Environment variables configured

## Database Schema

Ensure your PostgreSQL database has the following tables:

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Blog Posts Table (Updated)

The blog_posts table should already exist with UUID support. If not, ensure it matches:

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image VARCHAR(1000),
  read_time VARCHAR(50) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  updated_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP,
  views_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_created_by ON blog_posts(created_by);
CREATE INDEX idx_blog_posts_date ON blog_posts(date DESC);
```

## Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the environment variables with your actual values:
```env
# Database Configuration
DATABASE_USER=your_postgres_user
DATABASE_PASSWORD=your_postgres_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=blog_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-this>
```

3. Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```
Copy the output and paste it as the value for `NEXTAUTH_SECRET`.

## Creating Your First Admin User

Run the admin user creation script:

```bash
npm run db:seed-admin
```

The script will prompt you for:
- Admin Email (must be valid email format)
- Admin Name
- Admin Password (minimum 12 characters)
- Password Confirmation

Example:
```
============================================================
Admin User Creation Script
============================================================

Admin Email: admin@yourblog.com
Admin Name: Admin User
Admin Password (min 12 characters): ****************
Confirm Password: ****************

Creating admin user...

✓ Admin user created successfully!

User Details:
----------------------------------------
ID:    a1b2c3d4-e5f6-7890-abcd-ef1234567890
Email: admin@yourblog.com
Name:  Admin User
Role:  admin
----------------------------------------

You can now log in at: /admin/login
```

## Testing Authentication

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the login page:
```
http://localhost:3000/admin/login
```

3. Log in with the credentials you created

4. You should be redirected to the admin panel:
```
http://localhost:3000/admin/create/new
```

## Protected Routes

The following routes are now protected and require authentication:
- `/admin/create/*` - Create new posts
- `/admin/edit/*` - Edit existing posts

If you try to access these routes without being logged in, you'll be redirected to `/admin/login`.

## Session Management

- **Session Duration**: 7 days
- **Session Type**: JWT-based (stored in HTTP-Only cookies)
- **Cookie Security**: 
  - `httpOnly: true` - Cannot be accessed by JavaScript
  - `secure: true` - Only sent over HTTPS in production
  - `sameSite: 'lax'` - CSRF protection

## Logout

Currently, logout is handled automatically by NextAuth. To add a logout button:

```tsx
import { signOut } from 'next-auth/react';

<button onClick={() => signOut({ callbackUrl: '/admin/login' })}>
  Logout
</button>
```

## Troubleshooting

### Cannot Login

1. **Check database connection**: Ensure your PostgreSQL database is running and credentials are correct in `.env.local`

2. **Verify user exists**: 
```sql
SELECT * FROM users WHERE email = 'your@email.com';
```

3. **Check user is active**:
```sql
UPDATE users SET is_active = true WHERE email = 'your@email.com';
```

### Password Forgotten

To reset a user's password, run the seed script again with the same email, or manually update in the database:

1. Generate a new password hash:
```javascript
const bcrypt = require('bcryptjs');
const newHash = await bcrypt.hash('newpassword123', 10);
console.log(newHash);
```

2. Update in database:
```sql
UPDATE users 
SET password_hash = '$2b$10$...' 
WHERE email = 'your@email.com';
```

### Session Expired

Sessions expire after 7 days of inactivity. Simply log in again.

## Adding More Admin Users

To add additional admin users, run the seed script again:

```bash
npm run db:seed-admin
```

Or manually insert into the database (make sure to hash the password first with bcrypt).

## Security Best Practices

1. **Strong Passwords**: Require minimum 12 characters with mix of uppercase, lowercase, numbers, and special characters

2. **Environment Variables**: Never commit `.env.local` to version control

3. **HTTPS**: Always use HTTPS in production

4. **Secret Key**: Keep your `NEXTAUTH_SECRET` secure and never expose it

5. **Database Backup**: Regularly backup your users table

## Production Deployment

Before deploying to production:

1. ✅ Ensure `NEXTAUTH_URL` is set to your production domain
2. ✅ Ensure `NEXTAUTH_SECRET` is a strong, unique value
3. ✅ Database is accessible from your production environment
4. ✅ SSL/TLS is enabled on your database connection
5. ✅ Create at least one admin user
6. ✅ Test login/logout flow
7. ✅ Verify protected routes are actually protected

## Support

For issues or questions, refer to:
- NextAuth.js documentation: https://next-auth.js.org
- Authentication Implementation Report: `AUTHENTICATION_IMPLEMENTATION_REPORT.md`
