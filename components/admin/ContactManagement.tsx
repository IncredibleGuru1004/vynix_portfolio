'use client'

import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Eye, 
  Reply, 
  Trash2,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'
import PageHeader from './PageHeader'
import { 
  useContacts, 
  useUpdateContact, 
  useDeleteContact 
} from '@/hooks/useApi'
import { ContactSubmission, ContactFilters } from '@/lib/types'

const ContactManagement = () => {
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProject, setFilterProject] = useState('all')

  // API filters
  const filters: ContactFilters = {
    search: searchTerm || undefined,
    status: filterStatus !== 'all' ? filterStatus as any : undefined,
    project: filterProject !== 'all' ? filterProject : undefined
  }

  // API hooks
  const { data: contacts = [], loading, error, refetch } = useContacts(filters)
  const { updateContact, loading: updateLoading } = useUpdateContact()
  const { deleteContact, loading: deleteLoading } = useDeleteContact()

  const projects = ['All', 'Web Application', 'Mobile App', 'E-commerce Platform', 'Cloud Migration', 'API Development', 'Database Design', 'DevOps Setup', 'Security Audit', 'Other']
  const statuses = ['All', 'New', 'Read', 'Replied', 'Archived']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'read':
        return 'bg-yellow-100 text-yellow-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return AlertCircle
      case 'read':
        return Eye
      case 'replied':
        return CheckCircle
      case 'archived':
        return Clock
      default:
        return Clock
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateContact({ 
        id, 
        status: newStatus as any,
        repliedAt: newStatus === 'replied' ? new Date().toISOString() : undefined
      })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to update contact status:', error)
    }
  }

  const handleDeleteContact = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await deleteContact(id)
        if (selectedContact?.id === id) {
          setSelectedContact(null)
        }
        refetch() // Refresh the data
      } catch (error) {
        console.error('Failed to delete contact:', error)
      }
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

  const stats = {
    total: contacts?.length || 0,
    new: contacts?.filter(c => c.status === 'new').length || 0,
    read: contacts?.filter(c => c.status === 'read').length || 0,
    replied: contacts?.filter(c => c.status === 'replied').length || 0
  }

  return (
    <div>
      <PageHeader 
        title="Contact Management" 
        subtitle="Manage contact form submissions and client inquiries."
      />
      <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Contacts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              <p className="text-sm text-gray-600">New Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
              <p className="text-sm text-gray-600">Replied</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.read}</p>
              <p className="text-sm text-gray-600">Read</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status === 'All' ? 'all' : status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {projects.map(project => (
                  <option key={project} value={project === 'All' ? 'all' : project}>
                    {project}
                  </option>
                ))}
              </select>
              <div className="flex items-center text-sm text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                {contacts?.length || 0} contacts
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Loading contacts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error loading contacts: {error}</p>
              <button 
                onClick={refetch}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Contact List */}
          {!loading && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="divide-y divide-gray-200">
                {contacts?.map((contact) => {
                const StatusIcon = getStatusIcon(contact.status)
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-primary-50 border-r-4 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {contact.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {contact.company}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Project:</strong> {contact.project} • <strong>Budget:</strong> {contact.budget}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatDate(contact.submittedAt)}</p>
                          <div className="flex space-x-1 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(contact.id, 'read')
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(contact.id, 'replied')
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Mark as replied"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteContact(contact.id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-gray-600">{selectedContact.email}</p>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {selectedContact.company}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(selectedContact.submittedAt)}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                  <p className="text-sm text-gray-600"><strong>Type:</strong> {selectedContact.project}</p>
                  <p className="text-sm text-gray-600"><strong>Budget:</strong> {selectedContact.budget}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedContact.message}</p>
                </div>

                {selectedContact.repliedAt && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Replied:</strong> {formatDate(selectedContact.repliedAt)}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button className="w-full btn-primary flex items-center justify-center">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply to Contact
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedContact.id, 'read')}
                      className="btn-secondary text-sm"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedContact.id, 'archived')}
                      className="btn-secondary text-sm"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Contact</h3>
              <p className="text-gray-600">Choose a contact from the list to view details and manage the submission.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default ContactManagement

