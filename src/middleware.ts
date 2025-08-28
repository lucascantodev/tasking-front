import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('refreshToken');
  const token = cookie?.value;

  const isAuthPage =
    request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/join';

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/lists', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/lists/:path*', '/', '/join'],
};
