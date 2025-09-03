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
  Tag,
  Loader2
} from 'lucide-react'
import PageHeader from './PageHeader'
import { 
  useProjects, 
  useUpdateProject, 
  useDeleteProject 
} from '@/hooks/useApi'
import { Project, ProjectFilters } from '@/lib/types'

const ProjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // API filters
  const filters: ProjectFilters = {
    search: searchTerm || undefined,
    category: filterCategory !== 'all' ? filterCategory as any : undefined,
    status: filterStatus !== 'all' ? filterStatus as any : undefined
  }

  // API hooks
  const { data: projects = [], loading, error, refetch } = useProjects(filters)
  const { updateProject, loading: updateLoading } = useUpdateProject()
  const { deleteProject, loading: deleteLoading } = useDeleteProject()

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

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id)
        refetch() // Refresh the data
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateProject({ id, status: newStatus })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
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
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category === 'All' ? 'all' : category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status === 'All' ? 'all' : status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {projects?.length || 0} projects
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error loading projects: {error}</p>
            <button 
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => {
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
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
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
                    </div>

                    {/* Project Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
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
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
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
        )}

        {/* Empty State */}
        {!loading && !error && (projects?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-8 w-8 text-gray-400" />
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