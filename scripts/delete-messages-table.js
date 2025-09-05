require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient, DeleteTableCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function deleteMessagesTable() {
  try {
    await client.send(new DeleteTableCommand({
      TableName: 'CultureChat-Messages'
    }))
    console.log('Messages table deleted successfully')
  } catch (error) {
    console.error('Error deleting messages table:', error)
  }
}

deleteMessagesTable()