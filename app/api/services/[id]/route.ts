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
      return errorResponse('Invalid service ID')
    }

    const service = db.getService(id)
    
    if (!service) {
      return notFoundResponse('Service not found')
    }

    return successResponse(service, 'Service retrieved successfully')
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
      return errorResponse('Invalid service ID')
    }

    const body = await request.json()
    const updatedService = db.updateService(id, body)
    
    if (!updatedService) {
      return notFoundResponse('Service not found')
    }

    return successResponse(updatedService, 'Service updated successfully')
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
      return errorResponse('Invalid service ID')
    }

    const deleted = db.deleteService(id)
    
    if (!deleted) {
      return notFoundResponse('Service not found')
    }

    return successResponse(null, 'Service deleted successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

