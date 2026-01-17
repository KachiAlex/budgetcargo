import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/login'],
};

export default function middleware(req) {
  const url = new URL(req.url);
  if (url.pathname === '/login') {
    url.pathname = '/login.html';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
