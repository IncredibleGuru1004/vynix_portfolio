'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  FolderOpen, 
  Mail, 
  TrendingUp, 
  Eye, 
  Clock,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'

const AdminDashboard = () => {
  const { setPageInfo } = usePage()
  
  useEffect(() => {
    setPageInfo('Dashboard', 'Welcome back! Here\'s what\'s happening with your portfolio.')
  }, [setPageInfo])
  
  const [stats, setStats] = useState({
    totalProjects: 6,
    totalTeamMembers: 6,
    totalContacts: 12,
    totalViews: 2847
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'contact',
      message: 'New contact form submission from John Doe',
      time: '2 hours ago',
      icon: Mail
    },
    {
      id: 2,
      type: 'project',
      message: 'Project "E-Commerce Platform" was updated',
      time: '4 hours ago',
      icon: Edit
    },
    {
      id: 3,
      type: 'team',
      message: 'New team member Sarah Chen was added',
      time: '1 day ago',
      icon: Users
    },
    {
      id: 4,
      type: 'project',
      message: 'Project "Healthcare Mobile App" was published',
      time: '2 days ago',
      icon: Plus
    }
  ])

  const [recentContacts, setRecentContacts] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      project: 'Web Application',
      time: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@startup.com',
      company: 'StartupXYZ',
      project: 'Mobile App',
      time: '5 hours ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@enterprise.com',
      company: 'Enterprise Inc',
      project: 'Cloud Migration',
      time: '1 day ago'
    }
  ])

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Team Members',
      value: stats.totalTeamMembers,
      icon: Users,
      color: 'bg-green-500',
      change: '+1 this month'
    },
    {
      title: 'Contact Submissions',
      value: stats.totalContacts,
      icon: Mail,
      color: 'bg-purple-500',
      change: '+5 this week'
    },
    {
      title: 'Portfolio Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-orange-500',
      change: '+12% this month'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-end space-x-3">
        <button className="btn-secondary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </button>
        <button className="btn-primary flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Quick Edit
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Contacts</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                  <p className="text-xs text-gray-500">{contact.company} • {contact.project}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{contact.time}</p>
                  <button className="text-primary-600 hover:text-primary-700 text-xs font-medium mt-1">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Project</p>
                <p className="text-sm text-gray-600">Create a new portfolio project</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Team</p>
                <p className="text-sm text-gray-600">Update team member profiles</p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Messages</p>
                <p className="text-sm text-gray-600">Check contact form submissions</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

