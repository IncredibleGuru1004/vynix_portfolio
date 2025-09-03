'use client'

import { useState, useEffect } from 'react'
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react'

interface AdminHeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
}

const AdminHeader = ({ onMenuToggle, isSidebarOpen }: AdminHeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    const user = localStorage.getItem('currentUser')
    setUserRole(role || '')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem('adminToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('currentUser')
    // Force a page reload to ensure the layout re-renders without authentication
    window.location.href = '/admin/login'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Logo and Title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VI</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs sm:text-sm text-gray-500">Vynix Innovations</p>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 sm:space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                                 <div className="text-left hidden sm:block">
                   <p className="text-sm font-medium">
                     {userRole === 'admin' ? 'Admin User' : currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                   </p>
                   <p className="text-xs text-gray-500">
                     {userRole === 'admin' ? 'admin@vynix.com' : currentUser?.email || 'user@vynix.com'}
                   </p>
                 </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-3" />
                    Preferences
                  </button>
                  <hr className="my-1" />
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
