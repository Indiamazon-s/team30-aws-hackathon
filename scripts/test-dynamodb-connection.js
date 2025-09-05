require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function testConnection() {
  try {
    const result = await client.send(new ListTablesCommand({}))
    console.log('✅ DynamoDB 연결 성공!')
    console.log('테이블 목록:', result.TableNames)
  } catch (error) {
    console.error('❌ DynamoDB 연결 실패:', error.message)
  }
}

testConnection()