import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  const token = await getToken({ req, secret })

  const signInPage = '/api/auth/signin'

  // -------------------API routes protection-------------------
  if (req.nextUrl.pathname.startsWith('/api/users')) {
    // Have to be authenticated
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    } else {
      // Have to be admin
      if (token.roleId !== 1) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/events')) {
    // Only protect POST requests
    if (req.method === 'POST') {
      // Have to be authenticated
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/posts/')) {
    if (req.method === 'DELETE') {
      // Have to be authenticated
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
      // Have to be admin
      if (token.roleId == 1) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  if (req.nextUrl.pathname.startsWith('/api/posts')) {
    if (req.method === 'POST') {
      // Have to be authenticated
      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
    }
  }

  // -------------------Page routes protection-------------------
  if (req.nextUrl.pathname.startsWith('/chat')) {
    // Have to be authenticated
    if (!token) {
      return NextResponse.redirect(new URL(signInPage, req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Have to be authenticated
    if (!token) {
      return NextResponse.redirect(new URL(signInPage, req.url))
    } else {
      // Have to be admin
      if (token.roleId !== 1) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
}