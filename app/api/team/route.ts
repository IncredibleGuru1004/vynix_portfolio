import { NextRequest } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
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
import { TeamFilters, TeamMember, TeamRegistration } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = getQueryParams(request)
    const pagination = getPaginationParams(request)
    
    // Get filters
    const filters: TeamFilters = {
      status: searchParams.get('status') as any,
      availability: searchParams.get('availability') || undefined,
      search: searchParams.get('search') || undefined
    }

    // Helper function to convert Firebase Timestamp to ISO string
    const convertTimestamp = (timestamp: any) => {
      if (!timestamp) return null
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString()
      } else if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString()
      } else if (typeof timestamp === 'string') {
        return timestamp
      } else if (timestamp instanceof Date) {
        return timestamp.toISOString()
      }
      return timestamp
    }

    // Fetch approved team registrations from Firebase
    const q = query(
      collection(db, 'teamRegistrations'),
      where('status', '==', 'approved')
    )

    const snapshot = await getDocs(q)
    const registrations: TeamRegistration[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      
      registrations.push({
        id: doc.id,
        ...data,
        submittedAt: convertTimestamp(data.submittedAt),
        createdAt: convertTimestamp(data.createdAt) || convertTimestamp(data.submittedAt),
        updatedAt: convertTimestamp(data.updatedAt) || convertTimestamp(data.submittedAt),
      } as unknown as TeamRegistration)
    })

    // Fetch admin users that are related to team registrations
    const adminUsersQuery = query(
      collection(db, 'adminUsers'),
      where('isFromTeamRegistration', '==', true)
    )

    const adminUsersSnapshot = await getDocs(adminUsersQuery)
    const adminUsers: any[] = []

    adminUsersSnapshot.forEach((doc) => {
      const data = doc.data()
      adminUsers.push({
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        lastLoginAt: convertTimestamp(data.lastLoginAt),
        promotedAt: convertTimestamp(data.promotedAt),
        demotedAt: convertTimestamp(data.demotedAt),
      })
    })

    // Create a map of admin users by team registration ID for quick lookup
    const adminUsersByRegistrationId = new Map()
    adminUsers.forEach(adminUser => {
      if (adminUser.teamRegistrationId) {
        adminUsersByRegistrationId.set(adminUser.teamRegistrationId, adminUser)
      }
    })

    // Convert TeamRegistration to TeamMember format, merging with admin user data if available
    const teamMembers: TeamMember[] = registrations.map((reg, index) => {
      const relatedAdminUser = adminUsersByRegistrationId.get(reg.id)
      
      return {
        id: index + 1, // Use sequential ID for compatibility
        name: `${reg.firstName} ${reg.lastName}`,
        role: reg.position,
        image: reg.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reg.firstName + ' ' + reg.lastName)}&background=random&color=fff&size=400`,
        bio: reg.coverLetter || `Experienced ${reg.position} with ${reg.experience} of experience.`,
        skills: reg.skills ? reg.skills.split(',').map(s => s.trim()) : [],
        icon: 'Code', // Default icon
        color: 'from-blue-500 to-blue-600', // Default color
        social: {
          github: reg.github,
          linkedin: reg.linkedin,
          email: reg.email
        },
        status: 'active' as const,
        joinedDate: reg.submittedAt,
        experience: parseInt(reg.experience) || 0,
        location: reg.location,
        availability: reg.availability === 'full-time' ? 'available' : 
                     reg.availability === 'part-time' ? 'busy' : 'unavailable',
        createdAt: reg.createdAt,
        updatedAt: reg.updatedAt,
        // Additional fields from TeamRegistration
        originalRegistrationId: reg.id,
        position: reg.position,
        coverLetter: reg.coverLetter,
        // Admin user relationship fields
        adminUserId: relatedAdminUser?.uid || null,
        isFromTeamRegistration: !!relatedAdminUser,
        lastLoginAt: relatedAdminUser?.lastLoginAt || null
      }
    })

    // Apply search
    let filteredMembers = teamMembers
    if (filters.search) {
      filteredMembers = searchData(teamMembers, filters.search, ['name', 'role', 'bio', 'skills'])
    }

    // Apply filters
    const filterObj: Record<string, any> = {}
    if (filters.status) filterObj.status = filters.status
    if (filters.availability) filterObj.availability = filters.availability

    if (Object.keys(filterObj).length > 0) {
      filteredMembers = filterData(filteredMembers, filterObj)
    }

    // Sort by submittedAt (most recent first) - client-side sorting
    filteredMembers = filteredMembers.sort((a, b) => {
      const dateA = new Date(a.joinedDate).getTime()
      const dateB = new Date(b.joinedDate).getTime()
      return dateB - dateA // Descending order (newest first)
    })

    // Apply additional sorting if specified
    if (pagination.sortBy && pagination.sortBy !== 'joinedDate') {
      filteredMembers = sortData(filteredMembers, pagination.sortBy!, pagination.sortOrder!)
    }

    // Apply pagination
    const result = paginateData(filteredMembers, pagination.page!, pagination.limit!)

    return successResponse(result.data, 'Team members retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // This endpoint is now read-only for team members
    // Team members are created through the approval process
    return errorResponse('Team members are created through the approval process. Use the team registration approval workflow.')
  } catch (error) {
    return handleApiError(error)
  }
}

