import PendingApprovals from '@/components/admin/PendingApprovals'
import AdminAuthGuard from '@/components/admin/AdminAuthGuard'

export const metadata = {
  title: 'Pending Approvals - Admin Panel',
  description: 'Review and approve team member applications',
}

export default function ApprovalsPage() {
  return (
    <AdminAuthGuard>
      <PendingApprovals />
    </AdminAuthGuard>
  )
}
