'use client'

import { useState } from 'react'
import { 
  X, 
  UserPlus, 
  Mail, 
  User, 
  Crown, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Copy
} from 'lucide-react'
import { AdminClass, CreateAdminRequest } from '@/lib/types'
import { auth } from '@/lib/firebase'

interface AddAdminFormProps {
  onClose: () => void
  onSuccess: () => void
}

const AdminClassOptions: AdminClass[] = [
  'CEO',
  'CTO', 
  'CFO',
  'COO',
  'CMO',
  'VP Engineering',
  'VP Product',
  'VP Sales',
  'VP Marketing',
  'Director',
  'Manager',
  'Lead',
  'Senior',
  'Standard'
]

const AdminClassColors: Record<AdminClass, string> = {
  'CEO': 'bg-red-100 text-red-800 border-red-200',
  'CTO': 'bg-blue-100 text-blue-800 border-blue-200',
  'CFO': 'bg-green-100 text-green-800 border-green-200',
  'COO': 'bg-purple-100 text-purple-800 border-purple-200',
  'CMO': 'bg-pink-100 text-pink-800 border-pink-200',
  'VP Engineering': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'VP Product': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'VP Sales': 'bg-orange-100 text-orange-800 border-orange-200',
  'VP Marketing': 'bg-teal-100 text-teal-800 border-teal-200',
  'Director': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Manager': 'bg-gray-100 text-gray-800 border-gray-200',
  'Lead': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Senior': 'bg-amber-100 text-amber-800 border-amber-200',
  'Standard': 'bg-slate-100 text-slate-800 border-slate-200'
}

export default function AddAdminForm({ onClose, onSuccess }: AddAdminFormProps) {
  const [formData, setFormData] = useState<CreateAdminRequest>({
    email: '',
    displayName: '',
    adminClass: 'Standard',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
  const [passwordCopied, setPasswordCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (!formData.displayName?.trim()) {
      setError('Display name is required')
      return false
    }

    if (!formData.adminClass) {
      setError('Admin class is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get current user's ID token for authentication
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('You must be logged in to add admins')
      }

      const idToken = await currentUser.getIdToken()

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create admin')
      }

      // Store the generated password to display to the user
      setGeneratedPassword(result.data.temporaryPassword)
      setSuccess(true)
      // Don't auto-close the dialog - let user manually close it after copying password
      // onSuccess() will be called when user manually closes the dialog

    } catch (err) {
      console.error('Error creating admin:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create admin'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getAdminClassIcon = (adminClass: AdminClass) => {
    switch (adminClass) {
      case 'CEO':
      case 'CTO':
      case 'CFO':
      case 'COO':
      case 'CMO':
        return <Crown className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const copyPasswordToClipboard = async () => {
    if (generatedPassword) {
      try {
        await navigator.clipboard.writeText(generatedPassword)
        setPasswordCopied(true)
        setTimeout(() => setPasswordCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy password:', err)
      }
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Admin Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              {formData.displayName} has been added as a {formData.adminClass} admin.
            </p>
            
            <div className="flex justify-center mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${AdminClassColors[formData.adminClass]}`}>
                {getAdminClassIcon(formData.adminClass)}
                <span className="ml-2">{formData.adminClass}</span>
              </div>
            </div>

            {/* Display generated password */}
            {generatedPassword && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-2">⚠️ Important: Save this password!</p>
                    <p className="mb-2">The temporary password for <strong>{formData.email}</strong> is:</p>
                    <div className="bg-white border border-yellow-300 rounded px-3 py-2 font-mono text-sm break-all flex items-center justify-between">
                      <span className="flex-1">{generatedPassword}</span>
                      <button
                        onClick={copyPasswordToClipboard}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy password"
                      >
                        <Copy className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    {passwordCopied && (
                      <p className="text-xs text-green-600 mt-1">✓ Password copied to clipboard!</p>
                    )}
                    <p className="mt-2 text-xs">
                      This password will not be shown again. Please share it securely with the new admin.
                    </p>
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      <strong>Next steps:</strong> Send the email and password to the new admin. They can log in immediately and should change their password on first login.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 mt-6">
              <button
                onClick={() => {
                  onSuccess() // Refresh the admin list
                  onClose()   // Close the dialog
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Close & Refresh List
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Just Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Admin</h2>
              <p className="text-sm text-gray-600">Create a new admin user with specific role</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="admin@company.com"
                required
              />
            </div>
          </div>

          {/* Display Name Field */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Admin Class Selection */}
          <div>
            <label htmlFor="adminClass" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Class *
            </label>
            <select
              id="adminClass"
              name="adminClass"
              value={formData.adminClass}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              required
            >
              {AdminClassOptions.map((adminClass) => (
                <option key={adminClass} value={adminClass}>
                  {adminClass}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Select the appropriate admin class for this user
            </p>
          </div>

          {/* Preview of selected admin class */}
          {formData.adminClass && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${AdminClassColors[formData.adminClass]}`}>
                {getAdminClassIcon(formData.adminClass)}
                <span className="ml-2 font-medium">{formData.adminClass}</span>
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Temporary Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Leave empty for auto-generated password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Optional: Set a temporary password. If left empty, a secure password will be generated.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
