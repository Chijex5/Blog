import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if user has a valid token
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Protect all admin routes except login
export const config = {
  matcher: [
    '/admin/create/:path*',
    '/admin/edit/:path*',
    '/admin/dashboard',
  ],
};
