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
      return errorResponse('Invalid team member ID')
    }

    const teamMember = db.getTeamMember(id)
    
    if (!teamMember) {
      return notFoundResponse('Team member not found')
    }

    return successResponse(teamMember, 'Team member retrieved successfully')
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
      return errorResponse('Invalid team member ID')
    }

    const body = await request.json()

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['active', 'inactive']
      if (!validStatuses.includes(body.status)) {
        return errorResponse('Invalid status')
      }
    }

    // Validate availability if provided
    if (body.availability) {
      const validAvailability = ['available', 'busy', 'unavailable']
      if (!validAvailability.includes(body.availability)) {
        return errorResponse('Invalid availability')
      }
    }

    const updatedTeamMember = db.updateTeamMember(id, body)
    
    if (!updatedTeamMember) {
      return notFoundResponse('Team member not found')
    }

    return successResponse(updatedTeamMember, 'Team member updated successfully')
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
      return errorResponse('Invalid team member ID')
    }

    const deleted = db.deleteTeamMember(id)
    
    if (!deleted) {
      return notFoundResponse('Team member not found')
    }

    return successResponse(null, 'Team member deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

