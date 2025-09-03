import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  )
}

