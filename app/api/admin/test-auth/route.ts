import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    // Test admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    })

  } catch (error: any) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Authentication failed',
        details: {
          hasAuthHeader: !!request.headers.get('authorization'),
          authHeader: request.headers.get('authorization')?.substring(0, 20) + '...',
          envVars: {
            hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
            hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY
          }
        }
      },
      { status: 500 }
    )
  }
}
