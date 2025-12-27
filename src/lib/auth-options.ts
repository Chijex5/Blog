import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

// Use the existing database pool
const pool = new Pool({
  user: process.env.DATABASE_USER || "",
  password: process.env.DATABASE_PASSWORD || "",
  host: process.env.DATABASE_HOST || "",
  port: Number(process.env.DATABASE_PORT) || 0,
  database: process.env.DATABASE_NAME || "",
  ssl: process.env.DATABASE_HOST ? { 
    rejectUnauthorized: false,
  } : false,
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await pool.connect();
          
          try {
            // Query user from database
            const result = await client.query(
              'SELECT * FROM users WHERE email = $1 AND is_active = true',
              [credentials.email]
            );

            if (result.rows.length === 0) {
              return null;
            }

            const user = result.rows[0];

            // Verify password
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password_hash
            );

            if (!isPasswordValid) {
              return null;
            }

            // Update last login
            await client.query(
              'UPDATE users SET last_login = NOW() WHERE id = $1',
              [user.id]
            );

            // Return user object
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
