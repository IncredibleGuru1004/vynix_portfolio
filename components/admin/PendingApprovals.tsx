'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Github,
  Linkedin,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  Shield,
  AlertTriangle,
  Trash2
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'
import { useAuth } from '@/contexts/AuthContext'
import { TeamRegistration, UpdateTeamRegistrationRequest } from '@/lib/types'
import { auth } from '@/lib/firebase'
// Removed createTeamMemberAccount import - now using API endpoint

// Using TeamRegistration from types instead of local interface

const PendingApprovals = () => {
  const { setPageInfo } = usePage()
  const { user, isAdmin } = useAuth()
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([])
  const [selectedRegistration, setSelectedRegistration] = useState<TeamRegistration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string; name: string } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Helper function to get Firebase ID token
  const getIdToken = async () => {
    if (!auth.currentUser) {
      throw new Error('User not authenticated')
    }
    return await auth.currentUser.getIdToken()
  }

  const loadRegistrations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/team-registrations')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load registrations')
      }
      
      setRegistrations(result.data || [])
    } catch (err) {
      console.error('Error loading registrations:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load registrations'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setPageInfo('Team Approvals', 'Review and approve new team member registrations.')
    loadRegistrations()
  }, [setPageInfo, loadRegistrations])

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
                <p>Only administrators can access the team approvals page.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600">
              Your current role: <span className="font-medium text-gray-900">
                {user?.role === 'team-member' ? 'Team Member' : 'Unknown'}
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

  const handleApprove = async (registration: TeamRegistration) => {
    try {
      console.log('Starting approval process for:', registration.email)
      
      // First, create a user account for the approved team member using API endpoint
      console.log('Creating team member account...')
      const idToken = await getIdToken()
      const createResponse = await fetch('/api/admin/create-team-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: registration.email,
          firstName: registration.firstName,
          lastName: registration.lastName,
          position: registration.position
        }),
      })

      const createResult = await createResponse.json()

      if (!createResult.success) {
        throw new Error(createResult.error || 'Failed to create team member account')
      }

      const { password, user } = createResult.data
      console.log('Account created successfully:', user.email)

      // Then update the registration status
      console.log('Updating registration status...')
      const updateData: UpdateTeamRegistrationRequest = {
        id: registration.id,
        status: 'approved',
        reviewedBy: user?.email || 'admin',
        notes: `Approved by ${user?.displayName || 'admin'}. Login credentials sent to ${registration.email}. Temporary password: ${password}`
      }

      const response = await fetch(`/api/team-registrations/${registration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to approve registration')
      }
      console.log('Registration status updated successfully')

      // Show credentials modal
      console.log('Showing credentials modal...')
      setCredentials({
        email: registration.email,
        password: password,
        name: `${registration.firstName} ${registration.lastName}`
      })
      setShowCredentials(true)

      await loadRegistrations()
      setSelectedRegistration(null)
      showToast(`${registration.firstName} ${registration.lastName} has been approved!`, 'success')
    } catch (err) {
      console.error('Error approving registration:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve registration'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    }
  }

  const handleReject = async (registration: TeamRegistration) => {
    try {
      const updateData: UpdateTeamRegistrationRequest = {
        id: registration.id,
        status: 'rejected',
        reviewedBy: user?.email || 'admin',
        notes: `Rejected by ${user?.displayName || 'admin'}`
      }

      const response = await fetch(`/api/team-registrations/${registration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to reject registration')
      }

      await loadRegistrations()
      setSelectedRegistration(null)
      showToast(`${registration.firstName} ${registration.lastName} has been rejected.`, 'success')
    } catch (err) {
      console.error('Error rejecting registration:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject registration'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    }
  }

  const handleRemove = async (registration: TeamRegistration) => {
    if (!confirm(`Are you sure you want to permanently remove ${registration.firstName} ${registration.lastName}'s application? This action cannot be undone.`)) {
      return
    }

    try {
      const idToken = await getIdToken()
      const response = await fetch(`/api/team-registrations/${registration.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to remove registration')
      }

      await loadRegistrations()
      setSelectedRegistration(null)
      showToast(`${registration.firstName} ${registration.lastName}'s application has been removed.`, 'success')
    } catch (err) {
      console.error('Error removing registration:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove registration'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    }
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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard!`, 'success')
    } catch (err) {
      showToast(`Failed to copy ${label}`, 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading registrations...</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Registrations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRegistrations}
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {registrations.filter(r => r.status === 'pending').length} pending applications
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {registrations.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Applications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {registrations.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">New team member applications will appear here.</p>
              </div>
            ) : (
              registrations.map((registration) => (
                <div key={registration.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{registration.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{registration.position}</span>
                          <span className="text-xs text-gray-500">{registration.experience}</span>
                          <span className="text-xs text-gray-500">{registration.availability}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(registration.status)}
                      <span className="text-xs text-gray-500">
                        {formatDate(registration.submittedAt)}
                      </span>
                      <button
                        onClick={() => setSelectedRegistration(registration)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(registration)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Registration Detail Modal - Outside main content */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Application Details
              </h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-600" />
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">
                      {selectedRegistration.firstName} {selectedRegistration.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.location || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
                  Professional Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.availability}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <p className="text-sm text-gray-900">{selectedRegistration.skills}</p>
                  </div>
                </div>
              </div>

              {/* Portfolio Links */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-primary-600" />
                  Portfolio & Links
                </h3>
                <div className="space-y-3">
                  {selectedRegistration.github && (
                    <div className="flex items-center space-x-3">
                      <Github className="h-4 w-4 text-gray-400" />
                      <a
                        href={selectedRegistration.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {selectedRegistration.github}
                      </a>
                    </div>
                  )}
                  {selectedRegistration.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <a
                        href={selectedRegistration.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {selectedRegistration.linkedin}
                      </a>
                    </div>
                  )}
                  {selectedRegistration.portfolio && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <a
                        href={selectedRegistration.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {selectedRegistration.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600" />
                  Cover Letter
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedRegistration.coverLetter}
                  </p>
                </div>
              </div>

              {/* Application Date */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Application Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedRegistration.submittedAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => handleRemove(selectedRegistration)}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </button>
              {selectedRegistration.status === 'pending' && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleReject(selectedRegistration)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRegistration)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal - Outside main content */}
      {showCredentials && credentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Member Approved
              </h2>
              <button
                onClick={() => setShowCredentials(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {credentials.name} has been approved!
                </h3>
                <p className="text-gray-600">
                  Share these login credentials with the team member:
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={credentials.email}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(credentials.email, 'Email')}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temporary Password
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={credentials.password}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(credentials.password, 'Password')}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1">
                      <li>• The team member should change their password after first login</li>
                      <li>• They can access the admin panel at <code className="bg-yellow-100 px-1 rounded">/admin/login</code></li>
                      <li>• Their role will be &quot;Team Member&quot; with limited permissions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCredentials(false)}
                  className="btn-primary"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Toast Notification - Outside main content */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
          <div className={`relative px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border flex items-center space-x-3 min-w-[320px] max-w-md transform transition-all duration-300 hover:scale-105 ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400'
          }`}>
            {/* Icon */}
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
            
            {/* Message */}
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">{toast.message}</p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200 group"
              title="Close notification"
            >
              <XCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            </button>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30 rounded-b-xl overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: '100%',
                  animation: 'progress 4s linear forwards'
                }}
              ></div>
            </div>
            
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-xl opacity-20 blur-sm -z-10 ${
              toast.type === 'success' 
                ? 'bg-green-400' 
                : 'bg-red-400'
            }`}></div>
          </div>
        </div>
      )}
    </>
  )
}

export default PendingApprovals
