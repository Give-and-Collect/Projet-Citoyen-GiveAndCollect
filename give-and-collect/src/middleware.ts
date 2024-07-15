import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

const AUTH_ERROR_RESPONSE = new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

type RequestBody = {
  organizerId?: number;
  authorId?: number;
};

async function authenticate(req: NextRequest, token: JWT | null): Promise<NextResponse | undefined> {
  if (!token) {
    return AUTH_ERROR_RESPONSE;
  }
}

async function authorizeAdmin(token: JWT): Promise<NextResponse | undefined> {
  if (token.roleId !== 1) {
    return AUTH_ERROR_RESPONSE;
  }
}

async function authorizeUserOrAdmin(token: JWT, requestBody: RequestBody, key: keyof RequestBody): Promise<NextResponse | undefined> {
  if (token.roleId !== 1 && requestBody[key] !== token.id) {
    return AUTH_ERROR_RESPONSE;
  }
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const signInPage = '/api/auth/signin';

  const { pathname } = req.nextUrl;
  const method = req.method;

  // API routes protection
  if (pathname.startsWith('/api/users')) {
    const authResponse = await authenticate(req, token);
    if (authResponse) return authResponse;

    const adminResponse = await authorizeAdmin(token!);
    if (adminResponse) return adminResponse;
  }

  if (pathname.startsWith('/api/events')) {
    if (method === 'POST' || method === 'DELETE') {
      const authResponse = await authenticate(req, token);
      if (authResponse) return authResponse;
    }

    if (method === 'DELETE') {
      const requestBody: RequestBody = await req.json();
      const authUserOrAdminResponse = await authorizeUserOrAdmin(token!, requestBody, 'organizerId');
      if (authUserOrAdminResponse) return authUserOrAdminResponse;
    }
  }

  if (pathname.startsWith('/api/posts')) {
    if (method === 'POST' || method === 'DELETE') {
      const authResponse = await authenticate(req, token);
      if (authResponse) return authResponse;
    }

    if (method === 'DELETE') {
      const requestBody: RequestBody = await req.json();
      const authUserOrAdminResponse = await authorizeUserOrAdmin(token!, requestBody, 'authorId');
      if (authUserOrAdminResponse) return authUserOrAdminResponse;
    }
  }

  // Page routes protection
  if (pathname.startsWith('/admin')) {
    const authResponse = await authenticate(req, token);
    if (authResponse) return NextResponse.redirect(new URL(signInPage, req.url));

    const adminResponse = await authorizeAdmin(token!);
    if (adminResponse) return adminResponse;
  }

  if (pathname.startsWith('/profile')) {
    const authResponse = await authenticate(req, token);
    if (authResponse) return NextResponse.redirect(new URL(signInPage, req.url));
  }

  return NextResponse.next();
}
