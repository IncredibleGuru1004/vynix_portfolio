import { NextRequest, NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { requireAdmin } from '@/lib/auth-middleware'
import { CreateAdminRequest } from '@/lib/types'

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
const authAdmin = getAuth()

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Get all users from Firestore
    const usersSnapshot = await db.collection('adminUsers').get()
    
    // Helper function to convert Firebase Timestamp to ISO string
    const convertTimestamp = (timestamp: any) => {
      if (!timestamp) return null
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        // Firebase Timestamp object
        return timestamp.toDate().toISOString()
      } else if (timestamp.seconds) {
        // Serialized Timestamp object
        return new Date(timestamp.seconds * 1000).toISOString()
      } else if (typeof timestamp === 'string') {
        // Already a string
        return timestamp
      } else if (timestamp instanceof Date) {
        // Already a Date object
        return timestamp.toISOString()
      }
      return timestamp
    }
    
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        lastLoginAt: convertTimestamp(data.lastLoginAt),
        promotedAt: convertTimestamp(data.promotedAt),
        demotedAt: convertTimestamp(data.demotedAt),
      }
    })

    return NextResponse.json({
      success: true,
      data: users
    })

  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body: CreateAdminRequest = await request.json()
    const { email, displayName, adminClass, password } = body

    // Validate required fields
    if (!email || !adminClass) {
      return NextResponse.json(
        { success: false, error: 'Email and admin class are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      await authAdmin.getUserByEmail(email)
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    } catch (error: any) {
      // User doesn't exist, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    // Generate a secure password if not provided
    const finalPassword = password || generateSecurePassword()

    // Create Firebase Auth user
    const userRecord = await authAdmin.createUser({
      email,
      displayName,
      password: finalPassword,
    })

    // Get current admin user info for audit trail
    const currentUser = authResult.user

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || displayName,
      role: 'admin',
      adminClass,
      isApproved: true,
      createdAt: new Date(),
      createdBy: currentUser.uid,
      createdByEmail: currentUser.email,
    }

    await db.collection('adminUsers').doc(userRecord.uid).set(userData)

    return NextResponse.json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        adminClass,
        temporaryPassword: finalPassword,
      },
      message: 'Admin user created successfully'
    })

  } catch (error: any) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

// Helper function to generate secure password
function generateSecurePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each required character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)] // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)] // special char
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
