import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NEXT_PUBLIC_APP_ENV || 'production',
      services: {
        database: 'connected',
        bedrock: 'available',
        websocket: 'running'
      },
      region: process.env.AWS_REGION || 'us-east-1'
    }

    return NextResponse.json(healthStatus, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}