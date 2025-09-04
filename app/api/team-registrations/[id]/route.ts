import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { UpdateTeamRegistrationRequest, ApiResponse, TeamRegistration } from '@/lib/types'
import { requireAdmin } from '@/lib/auth-middleware'

// GET /api/team-registrations/[id] - Get a specific team registration
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'teamRegistrations', params.id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Team registration not found' },
        { status: 404 }
      )
    }

    const data = docSnap.data()
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Registration data not found' },
        { status: 404 }
      )
    }
    
    const registration: TeamRegistration = {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt || data.submittedAt,
      updatedAt: data.updatedAt || data.submittedAt,
    } as unknown as TeamRegistration

    const response: ApiResponse<TeamRegistration> = {
      success: true,
      data: registration
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching team registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team registration' },
      { status: 500 }
    )
  }
}

// PUT /api/team-registrations/[id] - Update a team registration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateTeamRegistrationRequest = await request.json()

    // Validate that the ID matches
    if (body.id !== params.id) {
      return NextResponse.json(
        { success: false, error: 'ID mismatch' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'teamRegistrations', params.id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Team registration not found' },
        { status: 404 }
      )
    }

    const { id, ...updateData } = {
      ...body,
      updatedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    }

    await updateDoc(docRef, updateData)

    // Get the updated document
    const updatedDoc = await getDoc(docRef)
    const data = updatedDoc.data()
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve updated registration' },
        { status: 500 }
      )
    }
    
    const updatedRegistration: TeamRegistration = {
      id: updatedDoc.id,
      ...data,
      createdAt: data.createdAt || data.submittedAt,
      updatedAt: data.updatedAt || data.submittedAt,
    } as unknown as TeamRegistration

    const response: ApiResponse<TeamRegistration> = {
      success: true,
      data: updatedRegistration,
      message: 'Team registration updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating team registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update team registration' },
      { status: 500 }
    )
  }
}

// DELETE /api/team-registrations/[id] - Delete a team registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user: adminUser } = authResult

    const docRef = doc(db, 'teamRegistrations', params.id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Team registration not found' },
        { status: 404 }
      )
    }

    await deleteDoc(docRef)

    const response: ApiResponse = {
      success: true,
      message: `Team registration deleted successfully by ${adminUser.email}`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting team registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team registration' },
      { status: 500 }
    )
  }
}
