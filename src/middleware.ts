import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  // Public routes (accessible without login)
  const publicRoutes = ['/login', '/register', '/forgot-password']

  // ✅ Allow access to public routes without auth
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 🚫 No token — redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 🛡️ Protect /admin route — only admins can access
  if (pathname.startsWith('/admin')) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Cookie: `token=${token}` },
        credentials: 'include',
      })
      const data = await res.json()

      if (data?.user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // ✅ Allow access if everything is fine
  return NextResponse.next()
}

// ✅ Apply to all routes except Next.js internals, static files, and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
