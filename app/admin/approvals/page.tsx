import PendingApprovals from '@/components/admin/PendingApprovals'
import AdminOnlyGuard from '@/components/admin/AdminOnlyGuard'

export const metadata = {
  title: 'Pending Approvals - Admin Panel',
  description: 'Review and approve team member applications',
}

export default function ApprovalsPage() {
  return (
    <AdminOnlyGuard>
      <PendingApprovals />
    </AdminOnlyGuard>
  )
}
