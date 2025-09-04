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

    // Prevent self-demotion
    if (userId === adminUser.uid) {
      return NextResponse.json(
        { success: false, error: 'Cannot demote yourself' },
        { status: 400 }
      )
    }

    // Get user document
    const userDoc = await db.collection('adminUsers').doc(userId).get()
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = userDoc.data()

    // Check if user is already a team member
    if (userData?.role === 'team-member') {
      return NextResponse.json(
        { success: false, error: 'User is already a team member' },
        { status: 400 }
      )
    }

    // Update user role to team member
    await db.collection('adminUsers').doc(userId).update({
      role: 'team-member',
      demotedBy: adminUser.uid,
      demotedByEmail: adminUser.email,
      demotedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      message: 'User demoted from admin successfully'
    })

  } catch (error: any) {
    console.error('Demote user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to demote user' },
      { status: 500 }
    )
  }
}
