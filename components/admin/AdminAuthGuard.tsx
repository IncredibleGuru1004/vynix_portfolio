'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, loading, isApprovedTeamMember } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      return
    }

    // Redirect to login if not authenticated or not approved
    if (!loading && (!user || !isApprovedTeamMember())) {
      router.replace('/admin/login')
    }
  }, [user, loading, isApprovedTeamMember, router, pathname])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated or not approved
  if (!user || !isApprovedTeamMember()) {
    return null
  }

  return <>{children}</>
}

export default AdminAuthGuard
