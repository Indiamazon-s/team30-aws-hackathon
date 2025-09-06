import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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

export const dynamodb = DynamoDBDocumentClient.from(client)