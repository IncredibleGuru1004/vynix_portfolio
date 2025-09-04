'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'
import { AuthProvider } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Handle window resize to close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  // Don't wrap login page with auth guard and sidebar
  if (pathname === '/admin/login') {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <AdminAuthGuard>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} onMenuToggle={toggleSidebar} />
          <main className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'
          }`}>
            {children}
          </main>
        </div>
      </AdminAuthGuard>
    </AuthProvider>
  )
}
