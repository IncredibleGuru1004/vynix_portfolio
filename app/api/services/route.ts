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
import { ServiceFilters } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Get filters
    const filters: ServiceFilters = {
      isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined
    }

    let services = db.getServices()

    // Apply search
    if (filters.search) {
      services = searchData(services, filters.search, ['title', 'description', 'technologies', 'features'])
    }

    // Apply filters
    const filterObj: Record<string, any> = {}
    if (filters.isActive !== undefined) filterObj.isActive = filters.isActive

    if (Object.keys(filterObj).length > 0) {
      services = filterData(services, filterObj)
    }

    // Apply sorting
    services = sortData(services, pagination.sortBy!, pagination.sortOrder!)

    // Apply pagination
    const result = paginateData(services, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Services retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'technologies', 'icon', 'color', 'features']
    const missing = requiredFields.filter(field => !body[field])
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Create service
    const service = db.createService({
      title: body.title,
      description: body.description,
      technologies: body.technologies,
      icon: body.icon,
      color: body.color,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || 0,
      features: body.features,
      pricing: body.pricing
    })

    return successResponse(service, 'Service created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

