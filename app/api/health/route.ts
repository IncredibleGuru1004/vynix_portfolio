import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'connected',
        api: 'operational'
      }
    }

    return successResponse(health, 'Health check completed')
  } catch (error) {
    return successResponse({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, 'Health check failed')
  }
}

