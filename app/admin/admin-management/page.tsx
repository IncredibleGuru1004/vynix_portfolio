import AdminManagement from '@/components/admin/AdminManagement'
import AdminOnlyGuard from '@/components/admin/AdminOnlyGuard'

export default function AdminManagementPage() {
  return (
    <AdminOnlyGuard>
      <AdminManagement />
    </AdminOnlyGuard>
  )
}
