'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePage } from '@/contexts/PageContext'

export default function TestPage() {
  const { user, loading, isAdmin, isApprovedTeamMember } = useAuth()
  const { setPageInfo } = usePage()

  useEffect(() => {
    if (loading) {
      setPageInfo('Test Page', 'Loading authentication status...')
    } else {
      setPageInfo('Firebase Auth Test Page', 'Debug Firebase authentication status')
    }
  }, [loading, setPageInfo])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Firebase Authentication Status</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">User Information</h3>
              <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
              <p><strong>UID:</strong> {user?.uid || 'None'}</p>
              <p><strong>Email:</strong> {user?.email || 'None'}</p>
              <p><strong>Display Name:</strong> {user?.displayName || 'None'}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Permissions</h3>
              <p><strong>Role:</strong> {user?.role || 'None'}</p>
              <p><strong>Is Approved:</strong> {user?.isApproved ? 'Yes' : 'No'}</p>
              <p><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</p>
              <p><strong>Can Access:</strong> {isApprovedTeamMember() ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Account Details</h3>
            <p><strong>Created At:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'None'}</p>
            <p><strong>Last Login:</strong> {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
