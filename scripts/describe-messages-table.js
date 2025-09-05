require('dotenv').config({ path: '.env.local' })
const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

async function describeMessagesTable() {
  try {
    const result = await client.send(new DescribeTableCommand({
      TableName: 'CultureChat-Messages'
    }))
    console.log('Table schema:', JSON.stringify(result.Table.KeySchema, null, 2))
    console.log('Attribute definitions:', JSON.stringify(result.Table.AttributeDefinitions, null, 2))
  } catch (error) {
    console.error('Error describing table:', error)
  }
}

describeMessagesTable()