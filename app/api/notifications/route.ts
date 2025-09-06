import { NextRequest, NextResponse } from 'next/server'

// SSE 기능 비활성화 - WebSocket 사용으로 변경
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'SSE notifications disabled. Use WebSocket instead.' 
  }, { status: 410 })
}