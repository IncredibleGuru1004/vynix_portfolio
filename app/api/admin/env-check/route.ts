import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }

    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    return NextResponse.json({
      success: true,
      envCheck,
      missingVars,
      message: missingVars.length > 0 
        ? `Missing environment variables: ${missingVars.join(', ')}`
        : 'All required environment variables are present'
    })

  } catch (error: any) {
    console.error('Env check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Environment check failed'
      },
      { status: 500 }
    )
  }
}
