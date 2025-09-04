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
