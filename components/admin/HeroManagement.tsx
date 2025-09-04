'use client'

import { useState, useEffect } from 'react'
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Loader2
} from 'lucide-react'
import { usePage } from '@/contexts/PageContext'
import {
  useActiveHeroContent,
  useUpdateHeroContent
} from '@/hooks/useApi'
import { HeroContent } from '@/lib/types'

const HeroManagement = () => {
  const { setPageInfo } = usePage()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // API hooks
  const { data: heroContent, loading, error, refetch } = useActiveHeroContent()
  const { updateHeroContent, loading: updateLoading } = useUpdateHeroContent()

  useEffect(() => {
    setPageInfo('Hero Management', 'Manage the main hero section content and settings.')
  }, [setPageInfo])

  const handleInputChange = async (field: string, value: string) => {
    if (!heroContent) return
    
    try {
      await updateHeroContent({
        id: heroContent.id,
        [field]: value
      })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to update hero content:', error)
    }
  }

  const handleButtonChange = async (buttonType: 'primaryButton' | 'secondaryButton', field: 'text' | 'link', value: string) => {
    if (!heroContent) return
    
    try {
      await updateHeroContent({
        id: heroContent.id,
        [buttonType]: {
          ...heroContent[buttonType],
          [field]: value
        }
      })
      refetch() // Refresh the data
    } catch (error) {
      console.error('Failed to update hero button:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // The save is handled by individual field updates
      setIsSaving(false)
      alert('Hero section content saved successfully!')
    } catch (error) {
      setIsSaving(false)
      console.error('Failed to save hero content:', error)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      refetch() // Refresh the data
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading hero content...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading hero content: {error}</p>
          <button
            onClick={refetch}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && heroContent && (
          <>
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
                          placeholder="Innovative Technology Solutions"
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
                          placeholder="Transforming Ideas into Digital Reality"
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Image URL
                        </label>
                        <input
                          type="url"
                          value={heroContent.backgroundImage || ''}
                          onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Call-to-Action Buttons</h2>
                    
                    <div className="space-y-6">
                      {/* Primary Button */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Primary Button</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={heroContent.primaryButton.text}
                              onChange={(e) => handleButtonChange('primaryButton', 'text', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Get Started"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={heroContent.primaryButton.link}
                              onChange={(e) => handleButtonChange('primaryButton', 'link', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="/contact"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Secondary Button */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Secondary Button</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={heroContent.secondaryButton.text}
                              onChange={(e) => handleButtonChange('secondaryButton', 'text', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="View Portfolio"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={heroContent.secondaryButton.link}
                              onChange={(e) => handleButtonChange('secondaryButton', 'link', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="/#portfolio"
                            />
                          </div>
                        </div>
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
                  <div 
                    className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-lg p-8 border border-gray-200 min-h-[400px] flex items-center justify-center"
                    style={{
                      backgroundImage: heroContent.backgroundImage ? `url(${heroContent.backgroundImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-2xl">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heroContent.title}
                        <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                          {heroContent.subtitle}
                        </span>
                      </h1>

                      <p className="text-lg text-gray-600 mb-8">
                        {heroContent.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                          href={heroContent.primaryButton.link}
                          className="btn-primary flex items-center justify-center group"
                        >
                          {heroContent.primaryButton.text}
                        </a>
                        <a 
                          href={heroContent.secondaryButton.link}
                          className="btn-secondary"
                        >
                          {heroContent.secondaryButton.text}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default HeroManagement