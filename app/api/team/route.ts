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
  handleApiError
} from '@/lib/api-utils'
import { TeamFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Get filters
    const filters: TeamFilters = {
      status: searchParams.get('status') as any,
      availability: searchParams.get('availability') || undefined,
      search: searchParams.get('search') || undefined
    }

    let teamMembers = db.getTeamMembers()

    // Apply search
    if (filters.search) {
      teamMembers = searchData(teamMembers, filters.search, ['name', 'role', 'bio', 'skills'])
    }

    // Apply filters
    const filterObj: Record<string, any> = {}
    if (filters.status) filterObj.status = filters.status
    if (filters.availability) filterObj.availability = filters.availability

    if (Object.keys(filterObj).length > 0) {
      teamMembers = filterData(teamMembers, filterObj)
    }

    // Apply sorting
    teamMembers = sortData(teamMembers, pagination.sortBy!, pagination.sortOrder!)

    // Apply pagination
    const result = paginateData(teamMembers, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Team members retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'role', 'image', 'bio', 'skills', 'icon', 'color', 'status', 'joinedDate', 'experience', 'availability']
    const missing = requiredFields.filter(field => !body[field])
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate status
    const validStatuses = ['active', 'inactive']
    if (!validStatuses.includes(body.status)) {
      return errorResponse('Invalid status')
    }

    // Validate availability
    const validAvailability = ['available', 'busy', 'unavailable']
    if (!validAvailability.includes(body.availability)) {
      return errorResponse('Invalid availability')
    }

    // Create team member
    const teamMember = db.createTeamMember({
      name: body.name,
      role: body.role,
      image: body.image,
      bio: body.bio,
      skills: body.skills,
      icon: body.icon,
      color: body.color,
      social: body.social || {},
      status: body.status,
      joinedDate: body.joinedDate,
      experience: body.experience,
      location: body.location,
      availability: body.availability
    })

    return successResponse(teamMember, 'Team member created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

