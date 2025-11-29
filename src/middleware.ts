import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification
// Must match the one used in /src/app/api/admin/auth/route.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Define paths
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isApiRoute = pathname.startsWith('/api');
  const isAuthApi = pathname.startsWith('/api/admin/auth');
  const isPublicApi = 
    pathname === '/api/contact' || 
    (method === 'GET' && (
      pathname.startsWith('/api/profile') ||
      pathname.startsWith('/api/projects') ||
      pathname.startsWith('/api/skills') ||
      pathname.startsWith('/api/education') ||
      pathname.startsWith('/api/experience') ||
      pathname.startsWith('/api/settings')
    ));

  // 2. Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // 3. Verify token function
  const verifyToken = async (token: string) => {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isAuthenticated = token ? await verifyToken(token) : false;

  // 4. Handle Admin Pages
  if (isAdminPage) {
    if (isLoginPage) {
      // If on login page and authenticated, redirect to dashboard
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      // Allow access to login page
      return NextResponse.next();
    }

    // If on protected admin page and not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      // loginUrl.searchParams.set('from', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Handle API Routes
  if (isApiRoute) {
    // Allow auth API (login/logout)
    if (isAuthApi) {
      return NextResponse.next();
    }

    // Allow public APIs (GET requests to content, POST to contact)
    if (isPublicApi) {
      return NextResponse.next();
    }

    // Protect all other API routes (POST/PUT/DELETE to content, etc.)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
