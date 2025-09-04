import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { requireAdmin } from '@/lib/auth-middleware'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user: adminUser } = authResult

    const userId = params.id

    // Get user document
    const userDoc = await db.collection('adminUsers').doc(userId).get()
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()

    // Check if user is already an admin
    if (userData?.role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'User is already an admin' },
        { status: 400 }
      )
    }

    // Update user role to admin
    await db.collection('adminUsers').doc(userId).update({
      role: 'admin',
      promotedBy: adminUser.uid,
      promotedByEmail: adminUser.email,
      promotedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: 'User promoted to admin successfully'
    })

  } catch (error: any) {
    console.error('Promote user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to promote user' },
      { status: 500 }
    )
  }
}
