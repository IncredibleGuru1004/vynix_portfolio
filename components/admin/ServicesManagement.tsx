'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Code,
  Server,
  Smartphone,
  Cloud,
  Database,
  Shield,
  Zap,
  Users,
  Monitor,
  Loader2
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'
import {
  useServices,
  useUpdateService,
  useDeleteService
} from '@/hooks/useApi'
import { Service, ServiceFilters } from '@/lib/types'

const ServicesManagement = () => {
  const { setPageInfo } = usePage()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [filterActive, setFilterActive] = useState('all')

  useEffect(() => {
    setPageInfo('Services Management', 'Manage your service offerings and pricing.')
  }, [setPageInfo])

  // API filters
  const filters: ServiceFilters = {
    isActive: filterActive === 'active' ? true : filterActive === 'inactive' ? false : undefined
  }

  // API hooks
  const { data: services = [], loading, error, refetch } = useServices(filters)
  const { updateService, loading: updateLoading } = useUpdateService()
  const { deleteService, loading: deleteLoading } = useDeleteService()

  const handleToggleActive = async (id: number) => {
    const service = services?.find(s => s.id === id)
    if (!service) return

    try {
      await updateService({ id, isActive: !service.isActive })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to toggle service status:', error)
    }
  }

  const handleDeleteService = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id)
        refetch() // Refresh the data
      } catch (error) {
        console.error('Failed to delete service:', error)
      }
    }
  }

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const service = services?.find(s => s.id === id)
    if (!service) return

    const sortedServices = [...(services || [])].sort((a, b) => a.order - b.order)
    const currentIndex = sortedServices.findIndex(s => s.id === id)
    
    if (direction === 'up' && currentIndex > 0) {
      const newIndex = currentIndex - 1
      const temp = sortedServices[currentIndex].order
      sortedServices[currentIndex].order = sortedServices[newIndex].order
      sortedServices[newIndex].order = temp
    } else if (direction === 'down' && currentIndex < sortedServices.length - 1) {
      const newIndex = currentIndex + 1
      const temp = sortedServices[currentIndex].order
      sortedServices[currentIndex].order = sortedServices[newIndex].order
      sortedServices[newIndex].order = temp
    }

    // Update the service order via API
    try {
      await updateService({ id, order: sortedServices[currentIndex].order })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to reorder service:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Add Service Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
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
                <p className="text-2xl font-bold text-gray-900">{services?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Services</p>
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
                  {services?.filter(s => s.isActive).length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Services</p>
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
                  {services?.reduce((acc, service) => acc + service.features.length, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              {services?.length || 0} services
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error loading services: {error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services && services
              .sort((a, b) => a.order - b.order)
              .map((service) => {
                return (
                  <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center`}>
                            <Code className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                            <p className="text-sm text-gray-600">{service.technologies.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => setEditingService(service)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.features.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{service.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleToggleActive(service.id)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            service.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </button>

                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleReorder(service.id, 'up')}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button 
                            onClick={() => handleReorder(service.id, 'down')}
                            className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (services?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              {filterActive !== 'all'
                ? 'Try adjusting your filters to see more services.'
                : 'Get started by adding your first service.'}
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </button>
          </div>
        )}

        {/* Add/Edit Service Modal would go here */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Service</h2>
                {/* Modal content would go here */}
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Save Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default ServicesManagement