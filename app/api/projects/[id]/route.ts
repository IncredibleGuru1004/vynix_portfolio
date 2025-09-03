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
      return errorResponse('Invalid project ID')
    }

    const project = db.getProject(id)
    
    if (!project) {
      return notFoundResponse('Project not found')
    }

    return successResponse(project, 'Project retrieved successfully')
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
      return errorResponse('Invalid project ID')
    }

    const body = await request.json()

    // Validate category if provided
    if (body.category) {
      const validCategories = ['Web Application', 'Mobile App', 'Data Analytics', 'Cloud Solutions', 'IoT Solutions', 'E-commerce', 'API Development', 'DevOps']
      if (!validCategories.includes(body.category)) {
        return errorResponse('Invalid category')
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['published', 'draft', 'archived']
      if (!validStatuses.includes(body.status)) {
        return errorResponse('Invalid status')
      }
    }

    const updatedProject = db.updateProject(id, body)
    
    if (!updatedProject) {
      return notFoundResponse('Project not found')
    }

    return successResponse(updatedProject, 'Project updated successfully')
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
      return errorResponse('Invalid project ID')
    }

    const deleted = db.deleteProject(id)
    
    if (!deleted) {
      return notFoundResponse('Project not found')
    }

    return successResponse(null, 'Project deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

