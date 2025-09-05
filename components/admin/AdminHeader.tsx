'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { usePage } from '@/contexts/PageContext'
import Avatar from '@/components/ui/Avatar'
import { useUserAvatar } from '@/hooks/useUserAvatar'

interface AdminHeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
}

const AdminHeader = ({ onMenuToggle, isSidebarOpen }: AdminHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()
  const { title, subtitle } = usePage()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Use custom hook to fetch avatar image from team registration
  const { avatarImage, isLoading: isLoadingAvatar } = useUserAvatar(user?.uid)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
      // Force redirect even if signOut fails
      router.push('/admin/login')
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 lg:left-64 right-0 z-40">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button & Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Avatar
                  src={avatarImage || undefined} // Use the fetched avatar image from team registration
                  name={user?.displayName || (isAdmin() ? 'Admin User' : 'Team Member')}
                  size="sm"
                  showStatus
                  status="online"
                  className="flex-shrink-0"
                  loading={isLoadingAvatar}
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">
                    {user?.displayName || (isAdmin() ? 'Admin User' : 'Team Member')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'user@vynix.com'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      router.push('/admin/profile')
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
