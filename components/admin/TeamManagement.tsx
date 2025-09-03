'use client'

import { useState } from 'react'
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
  Zap
} from 'lucide-react'
import PageHeader from './PageHeader'

interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  bio: string
  skills: string[]
  icon: any
  color: string
  social: {
    github: string
    linkedin: string
    twitter: string
  }
  status: 'active' | 'inactive'
  joinedDate: string
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Lead Full-Stack Developer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Expert in React, Node.js, and cloud architecture with 8+ years of experience building scalable web applications.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL'],
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      social: {
        github: 'https://github.com/sarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen'
      },
      status: 'active',
      joinedDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Mobile Development Specialist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Passionate mobile developer specializing in React Native and Flutter with expertise in cross-platform solutions.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      social: {
        github: 'https://github.com/marcusrod',
        linkedin: 'https://linkedin.com/in/marcusrod',
        twitter: 'https://twitter.com/marcusrod'
      },
      status: 'active',
      joinedDate: '2023-03-20'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'DevOps & Cloud Engineer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Cloud infrastructure expert with deep knowledge of AWS, Azure, and containerization technologies.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
      icon: Cloud,
      color: 'from-orange-500 to-orange-600',
      social: {
        github: 'https://github.com/emilywatson',
        linkedin: 'https://linkedin.com/in/emilywatson',
        twitter: 'https://twitter.com/emilywatson'
      },
      status: 'active',
      joinedDate: '2023-02-10'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleDeleteMember = (id: number) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter(member => member.id !== id))
    }
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, status: newStatus as any } : member
    ))
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

  return (
    <div>
      <PageHeader 
        title="Team Management" 
        subtitle="Manage your team members and their profiles."
      />
      <div className="p-6 space-y-6">
        {/* Add Team Member Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </button>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
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
                {teamMembers.filter(m => m.status === 'active').length}
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
                {teamMembers.reduce((acc, member) => acc + member.skills.length, 0)}
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
            {filteredMembers.length} of {teamMembers.length} members
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const IconComponent = member.icon
          return (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Member Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-primary-600 font-medium text-sm">{member.role}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => setEditingMember(member)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Github className="h-4 w-4 text-gray-600" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-gray-600 hover:text-blue-600" />
                  </a>
                  <a
                    href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@techflow.com`}
                    className="p-2 bg-gray-100 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <Mail className="h-4 w-4 text-gray-600 hover:text-primary-600" />
                  </a>
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

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters to see more members.'
              : 'Get started by adding your first team member.'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </button>
        </div>
      )}

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Team Member</h2>
              {/* Modal content would go here */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  Save Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default TeamManagement

