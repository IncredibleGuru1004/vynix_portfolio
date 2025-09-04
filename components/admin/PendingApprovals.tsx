'use client'

import { useState, useEffect } from 'react'
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
  FileText
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'

interface PendingRegistration {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  position: string
  experience: string
  skills: string
  github: string
  linkedin: string
  portfolio: string
  coverLetter: string
  availability: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const PendingApprovals = () => {
  const { setPageInfo } = usePage()
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([])
  const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setPageInfo('Team Approvals', 'Review and approve new team member registrations.')
    loadRegistrations()
  }, [setPageInfo])

  const loadRegistrations = () => {
    const pendingRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]')
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]')
    
    // Combine pending registrations with approved users
    const allRegistrations = [...pendingRegistrations, ...approvedUsers]
    setRegistrations(allRegistrations)
    setIsLoading(false)
  }

  const handleApprove = (registration: PendingRegistration) => {
    // Move to approved users
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]')
    const updatedRegistration = { ...registration, status: 'approved' as const }
    approvedUsers.push(updatedRegistration)
    localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers))

    // Remove from pending
    const pendingRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]')
    const updatedPending = pendingRegistrations.filter((r: PendingRegistration) => r.id !== registration.id)
    localStorage.setItem('pendingRegistrations', JSON.stringify(updatedPending))

    loadRegistrations()
    setSelectedRegistration(null)
  }

  const handleReject = (registration: PendingRegistration) => {
    // Remove from pending
    const pendingRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]')
    const updatedPending = pendingRegistrations.filter((r: PendingRegistration) => r.id !== registration.id)
    localStorage.setItem('pendingRegistrations', JSON.stringify(updatedPending))

    loadRegistrations()
    setSelectedRegistration(null)
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
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
                        <span className="text-xs text-gray-500">{registration.experience} years</span>
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
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Registration Detail Modal */}
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
            
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
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
              <div>
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
                    <p className="text-sm text-gray-900">{selectedRegistration.experience} years</p>
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
              <div>
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
              <div>
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
              <div>
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
            {selectedRegistration.status === 'pending' && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
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
      )}
    </div>
  )
}

export default PendingApprovals
