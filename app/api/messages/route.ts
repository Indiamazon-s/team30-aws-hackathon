import { NextRequest, NextResponse } from 'next/server'
import { dynamodb } from '../../lib/dynamodb'
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

// api endpoint: chatid를 통해 메시지 조회
export async function GET(request: NextRequest) {
  console.log('[route] /api/messages 요청')
  const { searchParams } = new URL(request.url)
  const chatId = searchParams.get('chatId')
  if (!chatId) {
    console.log('chatId is required')
    return NextResponse.json({ error: 'chatId is required' }, { status: 400 })
  }
  
  console.log('Fetching messages for chatId:', chatId)

  try {
    // CultureChat-Messages 테이블에서 chatId가 동일한 것들을 조회
    const result = await dynamodb.send(new QueryCommand({
      TableName: 'CultureChat-Messages',
      KeyConditionExpression: 'chatId = :chatId',
      ExpressionAttributeValues: {
        ':chatId': chatId
      },
      ScanIndexForward: true
    }))

    // 데이터를 리턴
    return NextResponse.json(result.Items || [])
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}


// 메시지 저장 요청
export async function POST(request: NextRequest) {
  console.log('[api/messages] 뭐지?');
  try {
    const { chatId, text, isReceived, feedback } = await request.json()

    // 메시지 타입 정의
    const message = {
      id: Date.now().toString(),
      chatId,
      text,
      timestamp: new Date().toISOString(),
      isReceived: isReceived || false,
      feedback: feedback || null
    }

    // 디비 클라이언트로 메시지 추가 요청
    await dynamodb.send(new PutCommand({
      TableName: 'CultureChat-Messages',
      Item: message
    }))
    
    // 처리 완료
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}