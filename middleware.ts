import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For demo purposes, we'll handle authentication on the client side
  // In a real app, you'd validate the token with your backend
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
