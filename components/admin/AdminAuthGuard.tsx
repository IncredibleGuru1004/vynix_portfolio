'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    const checkAuth = () => {
      try {
        const adminToken = localStorage.getItem('adminToken')
        
        if (!adminToken) {
          router.replace('/admin/login')
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 50)
    return () => clearTimeout(timer)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AdminAuthGuard
