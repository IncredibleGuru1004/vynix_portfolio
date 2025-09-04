import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { CreateTeamRegistrationRequest, TeamRegistrationFilters, ApiResponse, TeamRegistration } from '@/lib/types'

// GET /api/team-registrations - Get all team registrations with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: TeamRegistrationFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: searchParams.get('status') as any || undefined,
      position: searchParams.get('position') || undefined,
      experience: searchParams.get('experience') || undefined,
      availability: searchParams.get('availability') || undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    }

    let q = query(collection(db, 'teamRegistrations'), orderBy('submittedAt', 'desc'))

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status))
    }
    if (filters.position) {
      q = query(q, where('position', '==', filters.position))
    }
    if (filters.experience) {
      q = query(q, where('experience', '==', filters.experience))
    }
    if (filters.availability) {
      q = query(q, where('availability', '==', filters.availability))
    }

    // Apply pagination
    const page = filters.page || 1
    const limitCount = filters.limit || 10
    const offset = (page - 1) * limitCount

    if (offset > 0) {
      // For pagination, we'd need to implement cursor-based pagination with startAfter
      // For now, we'll get all and slice (not ideal for large datasets)
    }

    const snapshot = await getDocs(q)
    const registrations: TeamRegistration[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      registrations.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt || data.submittedAt,
        updatedAt: data.updatedAt || data.submittedAt,
      } as unknown as TeamRegistration)
    })

    // Apply search filter (client-side for now)
    let filteredRegistrations = registrations
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredRegistrations = registrations.filter(reg => 
        reg.firstName.toLowerCase().includes(searchTerm) ||
        reg.lastName.toLowerCase().includes(searchTerm) ||
        reg.email.toLowerCase().includes(searchTerm) ||
        reg.position.toLowerCase().includes(searchTerm) ||
        reg.skills.toLowerCase().includes(searchTerm)
      )
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.submittedAt) >= fromDate
      )
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.submittedAt) <= toDate
      )
    }

    // Apply pagination
    const paginatedRegistrations = filteredRegistrations.slice(offset, offset + limitCount)

    const response: ApiResponse<TeamRegistration[]> = {
      success: true,
      data: paginatedRegistrations,
      pagination: {
        page,
        limit: limitCount,
        total: filteredRegistrations.length,
        totalPages: Math.ceil(filteredRegistrations.length / limitCount)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching team registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team registrations' },
      { status: 500 }
    )
  }
}

// POST /api/team-registrations - Create a new team registration
export async function POST(request: NextRequest) {
  try {
    const body: CreateTeamRegistrationRequest = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.position || !body.experience || !body.skills || !body.coverLetter) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingQuery = query(
      collection(db, 'teamRegistrations'),
      where('email', '==', body.email)
    )
    const existingSnapshot = await getDocs(existingQuery)
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    const now = new Date().toISOString()
    const registrationData = {
      ...body,
      status: 'pending',
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await addDoc(collection(db, 'teamRegistrations'), registrationData)

    const response: ApiResponse<TeamRegistration> = {
      success: true,
      data: {
        id: docRef.id,
        ...registrationData,
      } as TeamRegistration,
      message: 'Team registration submitted successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating team registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create team registration' },
      { status: 500 }
    )
  }
}
