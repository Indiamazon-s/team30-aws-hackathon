const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

const s3Client = new S3Client({ region: 'us-east-1' })

async function uploadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8')
    const encodedContent = Buffer.from(envContent).toString('base64')
    
    await s3Client.send(new PutObjectCommand({
      Bucket: 'culture-chat-config',
      Key: 'env/production.env',
      Body: encodedContent,
      ContentType: 'text/plain'
    }))
    
    console.log('✅ Environment file uploaded to S3')
  } catch (error) {
    console.error('❌ Upload failed:', error.message)
  }
}

uploadEnvFile()