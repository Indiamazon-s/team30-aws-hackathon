const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function createTables() {
  // Chats table
  const chatsTable = {
    TableName: 'CultureChat-Chats',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }

  // Messages table
  const messagesTable = {
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
  }

  try {
    await client.send(new CreateTableCommand(chatsTable))
    console.log('✅ Chats table created')
    
    await client.send(new CreateTableCommand(messagesTable))
    console.log('✅ Messages table created')
  } catch (error) {
    console.error('❌ Error creating tables:', error.message)
  }
}

createTables()