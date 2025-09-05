import { NextRequest, NextResponse } from 'next/server'
import { dynamodb } from '../../lib/dynamodb'
import { PutCommand } from '@aws-sdk/lib-dynamodb'


export async function POST(request: NextRequest) {
  try {
    const { name, country } = await request.json()
    
    if (!name || !country) {
      return NextResponse.json({ error: 'Name and country are required' }, { status: 400 })
    }
    
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const chatData = {
      id: chatId,
      name,
      country,
      lastMessage: '',
      timestamp: new Date().toISOString().split('T')[0],
      unread: 0,
      createdAt: new Date().toISOString()
    }

    console.log('Attempting to save chat data:', chatData)
    
    await dynamodb.send(new PutCommand({
      TableName: 'CultureChat-Chats',
      Item: chatData
    }))

    console.log('Chat saved successfully')
    return NextResponse.json(chatData)
  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json({ 
      error: 'Failed to create chat',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}