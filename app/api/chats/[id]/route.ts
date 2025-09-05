import { NextRequest, NextResponse } from 'next/server'
import { dynamodb } from '../../../lib/dynamodb'
import { GetCommand } from '@aws-sdk/lib-dynamodb'

// api endpoint: 채팅 개별 id 접속 요청
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 전체 채팅 테이블에서 채팅 id로 조회
    const result = await dynamodb.send(new GetCommand({
      TableName: 'CultureChat-Chats',
      Key: { id: params.id }
    }))

    if (!result.Item) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // 조회 결과 리턴
    return NextResponse.json(result.Item)
  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 })
  }
}