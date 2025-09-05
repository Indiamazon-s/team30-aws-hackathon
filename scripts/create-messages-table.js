require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function createMessagesTable() {
  try {
    await client.send(new CreateTableCommand({
      TableName: 'CultureChat-Messages',
      KeySchema: [
        { AttributeName: 'chatId', KeyType: 'HASH' },
        { AttributeName: 'id', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'chatId', AttributeType: 'S' },
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    }))
    console.log('Messages table created successfully')
  } catch (error) {
    console.error('Error creating messages table:', error)
  }
}

createMessagesTable()