import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  role: 'admin' | 'team-member'
  isApproved: boolean
  createdAt: Date
  lastLoginAt?: Date
}

// Sign in with email and password
export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'adminUsers', user.uid))
    
    if (!userDoc.exists()) {
      throw new Error('User not found in admin database')
    }
    
    const userData = userDoc.data() as AdminUser
    
    if (!userData.isApproved) {
      await signOut(auth)
      throw new Error('Account not approved by admin')
    }
    
    // Update last login time
    await setDoc(doc(db, 'adminUsers', user.uid), {
      ...userData,
      lastLoginAt: new Date()
    }, { merge: true })
    
    return {
      ...userData,
      lastLoginAt: new Date()
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    throw new Error(error.message || 'Failed to sign in')
  }
}

// Sign out
export const signOutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign out error:', error)
    throw new Error('Failed to sign out')
  }
}

// Create admin user
export const createAdminUser = async (
  email: string, 
  password: string, 
  displayName: string,
  role: 'admin' | 'team-member' = 'team-member'
): Promise<AdminUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Update display name
    await updateProfile(user, { displayName })
    
    // Create user document in Firestore
    const adminUser: AdminUser = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      isApproved: role === 'admin', // Auto-approve admins
      createdAt: new Date()
    }
    
    await setDoc(doc(db, 'adminUsers', user.uid), adminUser)
    
    return adminUser
  } catch (error: any) {
    console.error('Create user error:', error)
    throw new Error(error.message || 'Failed to create user')
  }
}

// Get current user data
export const getCurrentAdminUser = async (uid: string): Promise<AdminUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'adminUsers', uid))
    
    if (!userDoc.exists()) {
      return null
    }
    
    return userDoc.data() as AdminUser
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AdminUser | null) => void) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      try {
        const adminUser = await getCurrentAdminUser(user.uid)
        callback(adminUser)
      } catch (error) {
        console.error('Auth state change error:', error)
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}

// Check if user is admin
export const isAdmin = (user: AdminUser | null): boolean => {
  return user?.role === 'admin' && user?.isApproved === true
}

// Check if user is approved team member
export const isApprovedTeamMember = (user: AdminUser | null): boolean => {
  return user?.isApproved === true
}

// Note: createTeamMemberAccount function moved to API endpoint to prevent auth context issues
// The function is now available at /api/admin/create-team-member
