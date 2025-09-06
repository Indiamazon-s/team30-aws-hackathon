// 간단한 Cognito 연결 테스트
const config = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_MmqEN1v7J',
  client_id: '7tplqpb2otcfcvltm51keauesk',
  redirect_uri: 'http://localhost:3000',
  response_type: 'code',
  scope: 'email openid profile'
}

console.log('Config:', config)

// Well-known endpoint 테스트
fetch(config.authority + '/.well-known/openid_configuration')
  .then(res => res.json())
  .then(data => console.log('OIDC Discovery:', data))
  .catch(err => console.error('Error:', err))