'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/admin/PageHeader'

export default function TestPage() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    setToken(adminToken)
  }, [])

  return (
    <div>
      <PageHeader 
        title="Test Page" 
        subtitle="Debug authentication and localStorage"
      />
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Token in localStorage:</strong> {token ? 'Found' : 'Not found'}</p>
            <p><strong>Token value:</strong> {token || 'None'}</p>
            <p><strong>User Role:</strong> {localStorage.getItem('userRole') || 'None'}</p>
            <p><strong>Current User:</strong> {localStorage.getItem('currentUser') || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
