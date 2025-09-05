import { NextResponse } from 'next/server'
import { dynamodb } from '../../../lib/dynamodb'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'


// get api 포인트
export async function GET() {
  try {

    // 다이나모 db 에서 CultureChat-Chats 조회
    const result = await dynamodb.send(new ScanCommand({
      TableName: 'CultureChat-Chats'
    }))

    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching chats:', error)
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}