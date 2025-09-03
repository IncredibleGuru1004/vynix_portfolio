import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  getQueryParams,
  handleApiError
} from '@/lib/api-utils'
import { SearchResult, SearchResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const query = searchParams.get('q')
    
    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters long')
    }

    const searchTerm = query.toLowerCase().trim()
    const results: SearchResult[] = []

    // Search projects
    const projects = db.getProjects()
    projects.forEach(project => {
      const relevance = calculateRelevance(project, searchTerm, ['title', 'description', 'technologies', 'client'])
      if (relevance > 0) {
        results.push({
          type: 'project',
          id: project.id,
          title: project.title,
          description: project.description,
          url: `/admin/projects/${project.id}`,
          relevance
        })
      }
    })

    // Search services
    const services = db.getServices()
    services.forEach(service => {
      const relevance = calculateRelevance(service, searchTerm, ['title', 'description', 'technologies', 'features'])
      if (relevance > 0) {
        results.push({
          type: 'service',
          id: service.id,
          title: service.title,
          description: service.description,
          url: `/admin/services/${service.id}`,
          relevance
        })
      }
    })

    // Search team members
    const teamMembers = db.getTeamMembers()
    teamMembers.forEach(member => {
      const relevance = calculateRelevance(member, searchTerm, ['name', 'role', 'bio', 'skills'])
      if (relevance > 0) {
        results.push({
          type: 'team',
          id: member.id,
          title: member.name,
          description: `${member.role} - ${member.bio}`,
          url: `/admin/team/${member.id}`,
          relevance
        })
      }
    })

    // Search contacts
    const contacts = db.getContacts()
    contacts.forEach(contact => {
      const relevance = calculateRelevance(contact, searchTerm, ['name', 'email', 'company', 'project', 'message'])
      if (relevance > 0) {
        results.push({
          type: 'contact',
          id: contact.id,
          title: contact.name,
          description: `${contact.company} - ${contact.project}`,
          url: `/admin/contacts/${contact.id}`,
          relevance
        })
      }
    })

    // Sort by relevance and limit results
    const sortedResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20)

    const searchResponse: SearchResponse = {
      results: sortedResults,
      total: sortedResults.length,
      query,
      took: Date.now() // Simple timing, in real app would measure actual search time
    }

    return successResponse(searchResponse, 'Search completed successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

function calculateRelevance(item: any, searchTerm: string, fields: string[]): number {
  let relevance = 0
  
  fields.forEach(field => {
    const value = item[field]
    
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()
      if (lowerValue.includes(searchTerm)) {
        // Exact match gets higher score
        if (lowerValue === searchTerm) {
          relevance += 10
        } else if (lowerValue.startsWith(searchTerm)) {
          relevance += 8
        } else {
          relevance += 5
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach((v: any) => {
        if (typeof v === 'string' && v.toLowerCase().includes(searchTerm)) {
          relevance += 3
        }
      })
    }
  })
  
  return relevance
}

