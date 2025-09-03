import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  handleApiError
} from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return errorResponse('Invalid hero content ID')
    }

    const heroContent = db.getHeroContent().find(h => h.id === id)
    
    if (!heroContent) {
      return notFoundResponse('Hero content not found')
    }

    return successResponse(heroContent, 'Hero content retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return errorResponse('Invalid hero content ID')
    }

    const body = await request.json()

    // Validate button structure if provided
    if (body.primaryButton && (!body.primaryButton.text || !body.primaryButton.link)) {
      return errorResponse('Primary button must have text and link')
    }
    
    if (body.secondaryButton && (!body.secondaryButton.text || !body.secondaryButton.link)) {
      return errorResponse('Secondary button must have text and link')
    }

    // If setting as active, deactivate all other hero content
    if (body.isActive) {
      const existingContent = db.getHeroContent()
      existingContent.forEach(content => {
        if (content.isActive && content.id !== id) {
          db.updateHeroContent(content.id, { isActive: false })
        }
      })
    }

    const updatedHeroContent = db.updateHeroContent(id, body)
    
    if (!updatedHeroContent) {
      return notFoundResponse('Hero content not found')
    }

    return successResponse(updatedHeroContent, 'Hero content updated successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return errorResponse('Invalid hero content ID')
    }

    const deleted = db.deleteHeroContent(id)
    
    if (!deleted) {
      return notFoundResponse('Hero content not found')
    }

    return successResponse(null, 'Hero content deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

