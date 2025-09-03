'use client'

import { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Calendar,
  Tag
} from 'lucide-react'
import PageHeader from './PageHeader'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      category: 'Web Application',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      title: 'Healthcare Mobile App',
      description: 'Cross-platform mobile application for healthcare providers with patient management features.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      technologies: ['React Native', 'Firebase', 'Node.js', 'PostgreSQL'],
      category: 'Mobile App',
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      title: 'Financial Analytics Dashboard',
      description: 'Real-time financial data visualization platform with advanced analytics.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      technologies: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js', 'Docker'],
      category: 'Data Analytics',
      status: 'draft',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const categories = ['All', 'Web Application', 'Mobile App', 'Data Analytics', 'Cloud Solutions', 'IoT Solutions']
  const statuses = ['All', 'Published', 'Draft', 'Archived']

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Application':
        return Globe
      case 'Mobile App':
        return Smartphone
      case 'Data Analytics':
        return Database
      case 'Cloud Solutions':
        return Cloud
      default:
        return Globe
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDeleteProject = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, status: newStatus as any } : project
    ))
  }

  return (
    <div>
      <PageHeader 
        title="Project Management" 
        subtitle="Manage your portfolio projects and showcase your work."
      />
      <div className="p-6 space-y-6">
        {/* Add Project Button */}
        <div className="flex justify-end">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All' ? 'all' : category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
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

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const CategoryIcon = getCategoryIcon(project.category)
          return (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <CategoryIcon className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">{project.category}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Status Dropdown */}
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters to see more projects.'
              : 'Get started by adding your first project.'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>
      )}

      {/* Add/Edit Project Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Project</h2>
              {/* Modal content would go here */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  Save Project
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

export default ProjectManagement

