'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} onMenuToggle={toggleSidebar} />
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'
      }`}>
        {children}
      </main>
    </div>
  )
}
