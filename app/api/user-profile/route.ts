import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const getCredentials = () => {
  const accessKeyId = process.env.MY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.MY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
  
  if (accessKeyId && secretAccessKey) {
    return { accessKeyId, secretAccessKey }
  }
  return undefined
}

const client = new DynamoDBClient({
  region: process.env.MY_AWS_REGION || process.env.AWS_REGION || 'us-east-1',
  ...(getCredentials() && { credentials: getCredentials() })
})

const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { userId, email, nationality, language } = await request.json()

    const userProfile = {
      userId,
      email,
      nationality,
      language,
      createdAt: new Date().toISOString(),
      isProfileComplete: true
    }

    await docClient.send(new PutCommand({
      TableName: 'Users',
      Item: userProfile
    }))

    return NextResponse.json({ success: true, profile: userProfile })
  } catch (error) {
    console.error('Error saving user profile:', error)
    return NextResponse.json({ success: false, error: 'Failed to save profile' })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const result = await docClient.send(new GetCommand({
      TableName: 'Users',
      Key: { userId }
    }))

    return NextResponse.json({ profile: result.Item || null })
  } catch (error) {
    console.error('Error getting user profile:', error)
    return NextResponse.json({ profile: null })
  }
}