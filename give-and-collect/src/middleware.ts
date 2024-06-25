import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  const signInPage = '/api/auth/signin';

  // -------------------API routes protection-------------------
  if (req.nextUrl.pathname.startsWith('/api/users')) {
    // Have to be authenticated
    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    } else {
      // Have to be admin
      if (token.roleId !== 1) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/events')) {
    // Only protect POST requests
    if (req.method === 'POST') {
      // Have to be authenticated
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    if (req.method === 'DELETE') {
      // Have to be authenticated
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
    
      if (token.roleId !== 1) {
        const requestBody = await req.json();
        if (requestBody?.organizerId !== token.id) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/posts')) {
    if (req.method === 'POST') {
      // Must be authenticated
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    if (req.method === 'DELETE') {
      // Have to be authenticated
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      // Have to be admin
      if (token.roleId !== 1 )  {
        const requestBody = await req.json();
        if (requestBody?.authorId !== token.id) {
          return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
      }
    }
  }

  // -------------------Page routes protection-------------------
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Have to be authenticated
    if (!token) {
      return NextResponse.redirect(new URL(signInPage, req.url));
    } else {
      // Have to be admin
      if (token.roleId !== 1) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/chat', '/admin'],
};
