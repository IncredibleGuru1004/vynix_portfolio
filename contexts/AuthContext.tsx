'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChange, AdminUser, signOutAdmin } from '@/lib/firebase-auth'

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: () => boolean
  isApprovedTeamMember: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await signOutAdmin()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin' && user?.isApproved === true
  }

  const isApprovedTeamMember = () => {
    return user?.isApproved === true
  }

  const value = {
    user,
    loading,
    signOut,
    isAdmin,
    isApprovedTeamMember
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
