const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

let envCache = null

async function loadEnvFromS3() {
  if (envCache) return envCache

  try {
    const s3Client = new S3Client({ region: 'us-east-1' })
    
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: 'culture-chat-config',
      Key: 'env/production.env'
    }))
    
    const encodedContent = await response.Body.transformToString()
    const envContent = Buffer.from(encodedContent, 'base64').toString('utf8')
    
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && !key.startsWith('#')) {
        envVars[key.trim()] = valueParts.join('=').trim()
      }
    })
    
    envCache = envVars
    Object.assign(process.env, envVars)
    
    return envVars
  } catch (error) {
    console.log('S3 env load failed, using default env')
    return {}
  }
}

module.exports = { loadEnvFromS3 }