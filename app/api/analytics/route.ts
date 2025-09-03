import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  handleApiError
} from '@/lib/api-utils'
import { Analytics } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const projects = db.getProjects()
    const services = db.getServices()
    const teamMembers = db.getTeamMembers()
    const contacts = db.getContacts()

    // Calculate analytics
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const newContactsThisMonth = contacts.filter(contact => 
      new Date(contact.submittedAt) >= thisMonth
    ).length

    const contactStatusBreakdown = {
      new: contacts.filter(c => c.status === 'new').length,
      read: contacts.filter(c => c.status === 'read').length,
      replied: contacts.filter(c => c.status === 'replied').length,
      archived: contacts.filter(c => c.status === 'archived').length
    }

    const projectCategoryBreakdown = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Generate monthly contact trend for the last 12 months
    const monthlyContactTrend = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      
      const count = contacts.filter(contact => {
        const contactDate = new Date(contact.submittedAt)
        return contactDate >= monthStart && contactDate <= monthEnd
      }).length

      monthlyContactTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count
      })
    }

    const analytics: Analytics = {
      totalProjects: projects.length,
      totalServices: services.length,
      totalTeamMembers: teamMembers.length,
      totalContacts: contacts.length,
      newContactsThisMonth,
      publishedProjects: projects.filter(p => p.status === 'published').length,
      activeServices: services.filter(s => s.isActive).length,
      activeTeamMembers: teamMembers.filter(t => t.status === 'active').length,
      contactStatusBreakdown,
      projectCategoryBreakdown,
      monthlyContactTrend
    }

    return successResponse(analytics, 'Analytics retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

