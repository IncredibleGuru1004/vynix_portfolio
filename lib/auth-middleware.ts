import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error)
  }
}

const auth = getAuth()
const db = getFirestore()

export interface AuthenticatedUser {
  uid: string
  email: string
  role: 'admin' | 'team-member'
  isApproved: boolean
  displayName?: string
}

export async function verifyAuthToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found')
      return null
    }

    const idToken = authHeader.split('Bearer ')[1]
    console.log('Verifying token for user...')
    
    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken)
    console.log('Token verified for UID:', decodedToken.uid)
    
    // Get user data from Firestore
    const userDoc = await db.collection('adminUsers').doc(decodedToken.uid).get()
    
    if (!userDoc.exists) {
      console.log('User document not found in Firestore')
      return null
    }

    const userData = userDoc.data() as AuthenticatedUser
    console.log('User data found:', { role: userData.role, isApproved: userData.isApproved })
    
    // Check if user is approved
    if (!userData.isApproved) {
      console.log('User is not approved')
      return null
    }

    return userData
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export async function requireAdmin(request: NextRequest): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await verifyAuthToken(request)
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    )
  }

  return { user }
}

export async function requireApprovedUser(request: NextRequest): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await verifyAuthToken(request)
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    )
  }

  return { user }
}
