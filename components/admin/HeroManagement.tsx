'use client'

import { useState } from 'react'
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Code, 
  Smartphone, 
  Cloud, 
  Database,
  Zap,
  Shield,
  Users,
  ArrowRight
} from 'lucide-react'
import PageHeader from './PageHeader'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  primaryButtonText: string
  secondaryButtonText: string
  stats: {
    projects: string
    clients: string
    experience: string
    support: string
  }
  techIcons: {
    label: string
    icon: any
  }[]
  features: {
    icon: any
    text: string
    color: string
  }[]
}

const HeroManagement = () => {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'Building the Future of',
    subtitle: 'Digital Solutions',
    description: 'We\'re a premier IT development agency specializing in cutting-edge web applications, mobile solutions, cloud infrastructure, and digital transformation services.',
    primaryButtonText: 'Start Your Project',
    secondaryButtonText: 'View Our Work',
    stats: {
      projects: '150+',
      clients: '50+',
      experience: '5+',
      support: '24/7'
    },
    techIcons: [
      { label: 'Web Development', icon: Code },
      { label: 'Mobile Apps', icon: Smartphone },
      { label: 'Cloud Solutions', icon: Cloud },
      { label: 'Database Design', icon: Database }
    ],
    features: [
      { icon: Zap, text: 'Lightning-fast development', color: 'text-yellow-500' },
      { icon: Shield, text: 'Enterprise-grade security', color: 'text-green-500' },
      { icon: Users, text: 'Expert team collaboration', color: 'text-blue-500' }
    ]
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setHeroContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStatsChange = (stat: string, value: string) => {
    setHeroContent(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false)
      alert('Hero section content saved successfully!')
    }, 1000)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      // Reset to original content
      window.location.reload()
    }
  }

  return (
    <div>
      <PageHeader 
        title="Hero Section Management" 
        subtitle="Customize your homepage hero section content and messaging."
      />
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="btn-secondary flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        {!isPreviewMode && (
          <div className="space-y-6">
            {/* Main Content */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Main Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroContent.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Building the Future of"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle (Highlighted Text)
                  </label>
                  <input
                    type="text"
                    value={heroContent.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Digital Solutions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={heroContent.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Describe your agency and services..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={heroContent.primaryButtonText}
                      onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Start Your Project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={heroContent.secondaryButtonText}
                      onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="View Our Work"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projects Delivered
                  </label>
                  <input
                    type="text"
                    value={heroContent.stats.projects}
                    onChange={(e) => handleStatsChange('projects', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="150+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Happy Clients
                  </label>
                  <input
                    type="text"
                    value={heroContent.stats.clients}
                    onChange={(e) => handleStatsChange('clients', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years Experience
                  </label>
                  <input
                    type="text"
                    value={heroContent.stats.experience}
                    onChange={(e) => handleStatsChange('experience', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support
                  </label>
                  <input
                    type="text"
                    value={heroContent.stats.support}
                    onChange={(e) => handleStatsChange('support', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="24/7"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
            
            {/* Hero Section Preview */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-lg p-8 border border-gray-200">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {heroContent.title}
                  <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    {heroContent.subtitle}
                  </span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  {heroContent.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button className="btn-primary flex items-center justify-center group">
                    {heroContent.primaryButtonText}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="btn-secondary">
                    {heroContent.secondaryButtonText}
                  </button>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {heroContent.stats.projects}
                    </div>
                    <div className="text-sm text-gray-600">Projects Delivered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {heroContent.stats.clients}
                    </div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {heroContent.stats.experience}
                    </div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      {heroContent.stats.support}
                    </div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tech Stack Preview</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {heroContent.techIcons.map((tech, index) => {
                const IconComponent = tech.icon
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">{tech.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 space-y-3">
              {heroContent.features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className={`h-5 w-5 ${feature.color}`} />
                    <span className="text-sm text-gray-600">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default HeroManagement

