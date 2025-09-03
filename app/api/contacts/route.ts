import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  getPaginationParams,
  getQueryParams,
  sortData,
  filterData,
  searchData,
  paginateData,
  handleApiError,
  validateEmail
} from '@/lib/api-utils'
import { ContactFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Get filters
    const filters: ContactFilters = {
      status: searchParams.get('status') as any,
      project: searchParams.get('project') || undefined,
      priority: searchParams.get('priority') || undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined
    }

    let contacts = db.getContacts()

    // Apply search
    if (filters.search) {
      contacts = searchData(contacts, filters.search, ['name', 'email', 'company', 'project', 'message'])
    }

    // Apply filters
    const filterObj: Record<string, any> = {}
    if (filters.status) filterObj.status = filters.status
    if (filters.project) filterObj.project = filters.project
    if (filters.priority) filterObj.priority = filters.priority

    if (Object.keys(filterObj).length > 0) {
      contacts = filterData(contacts, filterObj)
    }

    // Apply date filters
    if (filters.dateFrom || filters.dateTo) {
      contacts = contacts.filter(contact => {
        const contactDate = new Date(contact.submittedAt)
        if (filters.dateFrom && contactDate < new Date(filters.dateFrom)) return false
        if (filters.dateTo && contactDate > new Date(filters.dateTo)) return false
        return true
      })
    }

    // Apply sorting
    contacts = sortData(contacts, pagination.sortBy!, pagination.sortOrder!)

    // Apply pagination
    const result = paginateData(contacts, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Contacts retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'company', 'project', 'budget', 'message']
    const missing = requiredFields.filter(field => !body[field])
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate email
    if (!validateEmail(body.email)) {
      return errorResponse('Invalid email address')
    }

    // Create contact
    const contact = db.createContact({
      name: body.name,
      email: body.email,
      company: body.company,
      project: body.project,
      budget: body.budget,
      message: body.message,
      status: 'new',
      submittedAt: new Date().toISOString(),
      phone: body.phone,
      website: body.website,
      timeline: body.timeline,
      priority: body.priority || 'medium'
    })

    return successResponse(contact, 'Contact submission created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

