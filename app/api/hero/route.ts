import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  getPaginationParams,
  getQueryParams,
  sortData,
  filterData,
  paginateData,
  handleApiError
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Check if requesting active hero content only
    const activeOnly = searchParams.get('active') === 'true'
    
    let heroContent = activeOnly ? [db.getActiveHeroContent()].filter(Boolean) : db.getHeroContent()

    // Apply sorting
    heroContent = sortData(heroContent, pagination.sortBy!, pagination.sortOrder!)

    // Apply pagination
    const result = paginateData(heroContent, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Hero content retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'description', 'primaryButton', 'secondaryButton']
    const missing = requiredFields.filter(field => !body[field])
    
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate button structure
    if (!body.primaryButton.text || !body.primaryButton.link) {
      return errorResponse('Primary button must have text and link')
    }
    
    if (!body.secondaryButton.text || !body.secondaryButton.link) {
      return errorResponse('Secondary button must have text and link')
    }

    // If setting as active, deactivate all other hero content
    if (body.isActive) {
      const existingContent = db.getHeroContent()
      existingContent.forEach(content => {
        if (content.isActive) {
          db.updateHeroContent(content.id, { isActive: false })
        }
      })
    }

    // Create hero content
    const heroContent = db.createHeroContent({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      primaryButton: body.primaryButton,
      secondaryButton: body.secondaryButton,
      backgroundImage: body.backgroundImage,
      isActive: body.isActive !== undefined ? body.isActive : false,
      order: body.order || 0
    })

    return successResponse(heroContent, 'Hero content created successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

