import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, PaginationParams } from './types'

// Response helpers
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export function errorResponse(message: string, status: number = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status })
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 404 })
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 401 })
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error: message
  }, { status: 403 })
}

// Request helpers
export async function getRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json()
  } catch (error) {
    throw new Error('Invalid JSON in request body')
  }
}

export function getQueryParams(request: NextRequest): URLSearchParams {
  return new URL(request.url).searchParams
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const searchParams = getQueryParams(request)
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  }
}

// Validation helpers
export function validateRequired(data: Record<string, any>, requiredFields: string[]): string[] {
  const missing: string[] = []
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field)
    }
  }
  return missing
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Pagination helpers
export function paginateData<T>(
  data: T[],
  page: number,
  limit: number
): { data: T[], pagination: any } {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    }
  }
}

// Sorting helpers
export function sortData<T>(
  data: T[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aValue = (a as any)[sortBy]
    const bValue = (b as any)[sortBy]
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

// Search helpers
export function searchData<T>(
  data: T[],
  searchTerm: string,
  searchFields: string[]
): T[] {
  if (!searchTerm) return data
  
  const term = searchTerm.toLowerCase()
  return data.filter(item => {
    return searchFields.some(field => {
      const value = (item as any)[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term)
      }
      if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(term)
        )
      }
      return false
    })
  })
}

// Filter helpers
export function filterData<T>(
  data: T[],
  filters: Record<string, any>
): T[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true
      
      const itemValue = (item as any)[key]
      
      if (typeof value === 'boolean') {
        return itemValue === value
      }
      
      if (typeof value === 'string') {
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }
        if (Array.isArray(itemValue)) {
          return itemValue.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())
          )
        }
      }
      
      return itemValue === value
    })
  })
}

// ID generation helpers
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Date helpers
export function formatDate(date: string | Date): string {
  return new Date(date).toISOString()
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// File upload helpers
export function validateImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}

// Rate limiting helpers (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now()
  const key = identifier
  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  return true
}

// CORS helpers
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Error handling
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return errorResponse(error.message, 500)
  }
  
  return errorResponse('Internal server error', 500)
}

// Middleware helpers
export function isAdminRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${process.env.ADMIN_TOKEN}`
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse('Admin access required')
  }
  return null
}

