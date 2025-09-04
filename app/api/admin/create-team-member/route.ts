import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
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

const auth = getAuth()
const db = getFirestore()

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user: adminUser } = authResult

    const { email, firstName, lastName, position } = await request.json()

    if (!email || !firstName || !lastName || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
    
    // Create user with Firebase Admin SDK (doesn't affect current session)
    const userRecord = await auth.createUser({
      email,
      password: tempPassword,
      displayName: `${firstName} ${lastName}`,
    })

    // Create user document in Firestore
    const teamMemberUser = {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName!,
      role: 'team-member',
      isApproved: true,
      createdAt: new Date(),
      createdBy: adminUser.uid, // Track who created this user
      createdByEmail: adminUser.email,
    }

    await db.collection('adminUsers').doc(userRecord.uid).set(teamMemberUser)

    return NextResponse.json({
      success: true,
      data: {
        password: tempPassword,
        user: adminUser
      }
    })

  } catch (error: any) {
    console.error('Create team member error:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create team member account' },
      { status: 500 }
    )
  }
}
