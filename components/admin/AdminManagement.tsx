'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Crown,
  UserPlus,
  Trash2,
  Edit,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePage } from '@/contexts/PageContext'
import { FirebaseAdminUser } from '@/lib/types'
import { auth } from '@/lib/firebase'

const AdminManagement = () => {
  const { setPageInfo } = usePage()
  const { user: currentUser, isAdmin } = useAuth()
  const [admins, setAdmins] = useState<FirebaseAdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<FirebaseAdminUser | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Helper function to get Firebase ID token
  const getIdToken = async () => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated')
    }
    return await auth.currentUser.getIdToken()
  }

  const loadAdmins = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Loading admins...')
      const idToken = await getIdToken()
      console.log('Got ID token:', idToken ? 'Yes' : 'No')
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })
      
      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load admins')
      }
      
      setAdmins(result.data || [])
    } catch (err) {
      console.error('Error loading admins:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load admins'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setPageInfo('Admin Management', 'Manage admin users and their permissions.')
    loadAdmins()
  }, [setPageInfo, loadAdmins])

  // Additional role check at component level
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
                <p>Only administrators can access the admin management page.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Your current role: <span className="font-medium text-gray-900">
                {currentUser?.role === 'team-member' ? 'Team Member' : 'Unknown'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Contact an administrator if you believe you should have access to this page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      const idToken = await getIdToken()
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to promote user')
      }

      await loadAdmins()
      showToast('User promoted to admin successfully!', 'success')
    } catch (err) {
      console.error('Error promoting user:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to promote user'
      showToast(errorMessage, 'error')
    }
  }

  const handleDemoteFromAdmin = async (userId: string) => {
    try {
      const idToken = await getIdToken()
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to demote user')
      }

      await loadAdmins()
      showToast('User demoted from admin successfully!', 'success')
    } catch (err) {
      console.error('Error demoting user:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to demote user'
      showToast(errorMessage, 'error')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const idToken = await getIdToken()
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user')
      }

      await loadAdmins()
      showToast('User deleted successfully!', 'success')
    } catch (err) {
      console.error('Error deleting user:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      showToast(errorMessage, 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const getRoleBadge = (role: string, isApproved: boolean) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Crown className="h-3 w-3 mr-1" />
          Admin
        </span>
      )
    }
    
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Team Member
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Loading admins...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Admins</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAdmins}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddAdmin(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Admin</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {admins.filter(a => a.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {admins.filter(a => a.role === 'team-member' && a.isApproved).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {admins.filter(a => !a.isApproved).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <div key={admin.uid} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {admin.displayName || 'Unknown User'}
                        {admin.uid === currentUser?.uid && (
                          <span className="ml-2 text-xs text-blue-600">(You)</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        {getRoleBadge(admin.role, admin.isApproved)}
                        <span className="text-xs text-gray-500">
                          Joined: {formatDate(admin.createdAt.toString())}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {admin.role === 'team-member' && admin.isApproved && (
                      <button
                        onClick={() => handlePromoteToAdmin(admin.uid)}
                        className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Promote to Admin"
                      >
                        <Crown className="h-4 w-4" />
                      </button>
                    )}
                    {admin.role === 'admin' && admin.uid !== currentUser?.uid && (
                      <button
                        onClick={() => handleDemoteFromAdmin(admin.uid)}
                        className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Demote from Admin"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    )}
                    {admin.uid !== currentUser?.uid && (
                      <button
                        onClick={() => handleDeleteUser(admin.uid)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <div className={`relative px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border flex items-center space-x-3 min-w-[320px] max-w-md transform transition-all duration-300 hover:scale-105 ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                  <XCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminManagement
