'use client'

import { useState } from 'react'
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
  Monitor
} from 'lucide-react'
import PageHeader from './PageHeader'

interface Service {
  id: number
  title: string
  description: string
  technologies: string[]
  icon: any
  color: string
  isActive: boolean
  order: number
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: 'Frontend Development',
      description: 'Modern, responsive web applications using React, Vue.js, and Angular with TypeScript.',
      technologies: ['React.js', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      isActive: true,
      order: 1
    },
    {
      id: 2,
      title: 'Backend Development',
      description: 'Scalable server-side solutions with Node.js, Python, Java, and PHP frameworks.',
      technologies: ['Node.js', 'Python', 'Java', 'PHP', 'Express.js', 'Django', 'Spring Boot'],
      icon: Server,
      color: 'from-green-500 to-green-600',
      isActive: true,
      order: 2
    },
    {
      id: 3,
      title: 'Mobile Development',
      description: 'Cross-platform mobile apps with React Native and Flutter for iOS and Android.',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Expo', 'Xcode'],
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      isActive: true,
      order: 3
    },
    {
      id: 4,
      title: 'Cloud Solutions',
      description: 'AWS, Azure, and Google Cloud infrastructure with containerization and DevOps.',
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
      icon: Cloud,
      color: 'from-orange-500 to-orange-600',
      isActive: true,
      order: 4
    },
    {
      id: 5,
      title: 'Database Design',
      description: 'SQL and NoSQL database solutions with optimization and security best practices.',
      technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs'],
      icon: Database,
      color: 'from-red-500 to-red-600',
      isActive: true,
      order: 5
    },
    {
      id: 6,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security implementation and compliance with industry standards.',
      technologies: ['SSL/TLS', 'OAuth', 'JWT', 'GDPR', 'HIPAA', 'SOC 2'],
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      isActive: true,
      order: 6
    },
    {
      id: 7,
      title: 'Performance Optimization',
      description: 'Application performance tuning, caching strategies, and scalability solutions.',
      technologies: ['CDN', 'Caching', 'Load Balancing', 'Monitoring', 'Analytics'],
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      isActive: true,
      order: 7
    },
    {
      id: 8,
      title: 'Team Augmentation',
      description: 'Expert developers and specialists to augment your existing development teams.',
      technologies: ['Agile', 'Scrum', 'DevOps', 'Code Review', 'Mentoring'],
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      isActive: true,
      order: 8
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [filterActive, setFilterActive] = useState('all')

  const filteredServices = services.filter(service => {
    if (filterActive === 'all') return true
    if (filterActive === 'active') return service.isActive
    if (filterActive === 'inactive') return !service.isActive
    return true
  })

  const handleToggleActive = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ))
  }

  const handleDeleteService = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id))
    }
  }

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    const service = services.find(s => s.id === id)
    if (!service) return

    const sortedServices = [...services].sort((a, b) => a.order - b.order)
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

    setServices(sortedServices)
  }

  return (
    <div>
      <PageHeader 
        title="Services Management" 
        subtitle="Manage your service offerings and technology stack."
      />
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
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              <p className="text-sm text-gray-600">Total Services</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {services.filter(s => s.isActive).length}
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
                {services.reduce((acc, service) => acc + service.technologies.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Technologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Services</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <div className="text-sm text-gray-600">
              {filteredServices.length} of {services.length} services
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices
          .sort((a, b) => a.order - b.order)
          .map((service) => {
            const IconComponent = service.icon
            return (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReorder(service.id, 'up')}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(service.id, 'down')}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{service.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={service.isActive}
                          onChange={() => handleToggleActive(service.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex space-x-2">
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
                </div>
              </div>
            )
          })}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
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

      {/* Add/Edit Modal would go here */}
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
    </div>
  )
}

export default ServicesManagement

