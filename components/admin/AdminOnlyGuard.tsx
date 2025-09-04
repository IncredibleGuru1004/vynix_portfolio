'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react'

interface AdminOnlyGuardProps {
  children: React.ReactNode
}

const AdminOnlyGuard = ({ children }: AdminOnlyGuardProps) => {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      return
    }

    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.replace('/admin/login')
      return
    }

    // Redirect to dashboard if not admin
    if (!loading && user && !isAdmin()) {
      router.replace('/admin')
      return
    }
  }, [user, loading, isAdmin, router, pathname])

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

  // Don't render children if not authenticated
  if (!user) {
    return null
  }

  // Show access denied message if not admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Admin Access Required</p>
                <p>You need administrator privileges to access this page.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Your current role: <span className="font-medium text-gray-900">
                {user.role === 'team-member' ? 'Team Member' : 'Unknown'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Contact an administrator if you believe you should have access to this page.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin')}
            className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AdminOnlyGuard
