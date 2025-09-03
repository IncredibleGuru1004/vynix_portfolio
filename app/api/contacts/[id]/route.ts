import { NextRequest } from 'next/server'
import { db } from '@/lib/database'
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  handleApiError,
  validateEmail
} from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return errorResponse('Invalid contact ID')
    }

    const contact = db.getContact(id)
    
    if (!contact) {
      return notFoundResponse('Contact not found')
    }

    return successResponse(contact, 'Contact retrieved successfully')
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
      return errorResponse('Invalid contact ID')
    }

    const body = await request.json()

    // Validate email if provided
    if (body.email && !validateEmail(body.email)) {
      return errorResponse('Invalid email address')
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['new', 'read', 'replied', 'archived']
      if (!validStatuses.includes(body.status)) {
        return errorResponse('Invalid status')
      }
    }

    // Validate priority if provided
    if (body.priority) {
      const validPriorities = ['low', 'medium', 'high']
      if (!validPriorities.includes(body.priority)) {
        return errorResponse('Invalid priority')
      }
    }

    // Set repliedAt if status is being changed to 'replied'
    if (body.status === 'replied') {
      body.repliedAt = new Date().toISOString()
    }

    const updatedContact = db.updateContact(id, body)
    
    if (!updatedContact) {
      return notFoundResponse('Contact not found')
    }

    return successResponse(updatedContact, 'Contact updated successfully')
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
      return errorResponse('Invalid contact ID')
    }

    const deleted = db.deleteContact(id)
    
    if (!deleted) {
      return notFoundResponse('Contact not found')
    }

    return successResponse(null, 'Contact deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

