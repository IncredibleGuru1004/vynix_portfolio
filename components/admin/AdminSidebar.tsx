'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  Mail,
  Code,
  BarChart3,
  ChevronDown,
  ChevronRight,
  X,
  UserCheck,
  Clock,
  Shield
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  onMenuToggle: () => void
}

const AdminSidebar = ({ isOpen, onClose, onMenuToggle }: AdminSidebarProps) => {
  const pathname = usePathname()
  const { isAdmin } = useAuth()
  const [expandedSections, setExpandedSections] = useState<string[]>(['content'])

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      exact: true
    },
    // Only show admin-only features to admin users
    ...(isAdmin() ? [
      {
        id: 'approvals',
        label: 'Team Approvals',
        icon: UserCheck,
        href: '/admin/approvals'
      },
      {
        id: 'admin-management',
        label: 'Admin Management',
        icon: Shield,
        href: '/admin/admin-management'
      }
    ] : []),
    {
      id: 'content',
      label: 'Content Management',
      icon: Code,
      children: [
        {
          label: 'Projects',
          icon: FolderOpen,
          href: '/admin/projects'
        },
        {
          label: 'Team Members',
          icon: Users,
          href: '/admin/team'
        },
        {
          label: 'Services',
          icon: Settings,
          href: '/admin/services'
        },
        {
          label: 'Hero Section',
          icon: BarChart3,
          href: '/admin/hero'
        }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: Mail,
      href: '/admin/contacts'
    },
    {
      id: 'test',
      label: 'Test Page',
      icon: Settings,
      href: '/admin/test'
    }
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

    return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Vynix</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      {expandedSections.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.includes(item.id) && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.children.map((child, index) => (
                          <li key={index}>
                            <Link
                              href={child.href}
                              onClick={handleLinkClick}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                isActive(child.href)
                                  ? 'bg-primary-100 text-primary-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <child.icon className="h-4 w-4 mr-3" />
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href, item.exact)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

      </aside>
    </>
  )
}

export default AdminSidebar
