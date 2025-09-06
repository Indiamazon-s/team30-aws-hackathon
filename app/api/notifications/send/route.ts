import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()
    
    console.log('SSE notification send deprecated - using WebSocket instead')
    
    return NextResponse.json({ 
      success: false,
      error: 'SSE notifications disabled. Use WebSocket instead.',
      data: notificationData
    }, { status: 410 })
    
  } catch (error) {
    console.error('Error in notification send:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}