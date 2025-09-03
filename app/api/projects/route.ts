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
import { ProjectFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Get filters
    const filters: ProjectFilters = {
      category: searchParams.get('category') as any,
      status: searchParams.get('status') as any,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined
    }

    let projects = db.getProjects()

    // Apply search
    if (filters.search) {
      projects = searchData(projects, filters.search, ['title', 'description', 'technologies', 'client'])
    }

    // Apply filters
    const filterObj: Record<string, any> = {}
    if (filters.category) filterObj.category = filters.category
    if (filters.status) filterObj.status = filters.status
    if (filters.featured !== undefined) filterObj.featured = filters.featured

    if (Object.keys(filterObj).length > 0) {
      projects = filterData(projects, filterObj)
    }

    // Apply sorting
    projects = sortData(projects, pagination.sortBy!, pagination.sortOrder!)

    // Apply pagination
    const result = paginateData(projects, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Projects retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'image', 'technologies', 'category', 'status']
    const missing = requiredFields.filter(field => !body[field])
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate category
    const validCategories = ['Web Application', 'Mobile App', 'Data Analytics', 'Cloud Solutions', 'IoT Solutions', 'E-commerce', 'API Development', 'DevOps']
    if (!validCategories.includes(body.category)) {
      return errorResponse('Invalid category')
    }

    // Validate status
    const validStatuses = ['published', 'draft', 'archived']
    if (!validStatuses.includes(body.status)) {
      return errorResponse('Invalid status')
    }

    // Create project
    const project = db.createProject({
      title: body.title,
      description: body.description,
      image: body.image,
      technologies: body.technologies,
      category: body.category,
      status: body.status,
      featured: body.featured || false,
      order: body.order || 0,
      liveUrl: body.liveUrl,
      githubUrl: body.githubUrl,
      client: body.client,
      duration: body.duration,
      teamSize: body.teamSize
    })

    return successResponse(project, 'Project created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

