'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit,
  Trash2,
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  Code,
  Smartphone,
  Cloud,
  Database,
  Shield,
  Zap,
  Loader2
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  useTeamMembers
} from '@/hooks/useApi'
import { TeamMember, TeamFilters } from '@/lib/types'
import Avatar from '@/components/ui/Avatar'

const TeamManagement = () => {
  const { setPageInfo } = usePage()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    setPageInfo('Team Management', 'View approved team members. New members are added through the approval process.')
  }, [setPageInfo])

  // API filters
  const filters: TeamFilters = {
    search: searchTerm || undefined,
    status: filterStatus !== 'all' ? filterStatus as any : undefined
  }

  // API hooks
  const { data: teamMembers = [], loading, error, refetch } = useTeamMembers(filters)

  const handleEditMember = (member: TeamMember) => {
    // TODO: Implement edit functionality
    console.log('Edit member:', member)
  }

  const handleDeleteMember = (member: TeamMember) => {
    // TODO: Implement delete functionality
    console.log('Delete member:', member)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Map icon string to actual component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Code': return Code
      case 'Smartphone': return Smartphone
      case 'Cloud': return Cloud
      case 'Database': return Database
      case 'Shield': return Shield
      case 'Zap': return Zap
      default: return Code
    }
  }

  return (
    <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{teamMembers?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers?.filter(m => m.status === 'active').length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers?.reduce((acc, member) => acc + member.skills.length, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              {teamMembers?.length || 0} members
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading team members...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error loading team members: {error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Team Members Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers && teamMembers.map((member) => {
              const IconComponent = getIconComponent(member.icon)
              return (
                <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Member Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar
                          src={member.image}
                          alt={member.name}
                          name={member.name}
                          size="lg"
                          roleIcon={IconComponent}
                          roleIconColor={member.color}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-primary-600 font-medium text-sm">{member.role}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      {isAdmin() && (
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditMember(member)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit member"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(member)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{member.bio}</p>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{member.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex space-x-2 mb-4">
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Github className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="p-2 bg-gray-100 hover:bg-primary-100 rounded-lg transition-colors"
                        >
                          <Mail className="h-4 w-4 text-gray-600 hover:text-primary-600" />
                        </a>
                      )}
                    </div>

                    {/* Joined Date */}
                    <div className="text-xs text-gray-500">
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (teamMembers?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters to see more members.'
                : 'No team members have been approved yet. Check the Approvals page to review pending applications.'}
            </p>
            <p className="text-gray-600">
              <a 
                href="/admin/approvals"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                Review Applications
              </a>
            </p>
          </div>
        )}

    </div>
  )
}

export default TeamManagement