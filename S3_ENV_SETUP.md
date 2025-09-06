# S3 환경변수 설정 가이드

## 1. S3 버킷 생성
```bash
aws s3 mb s3://culture-chat-config --region us-east-1
```

## 2. 환경변수 업로드
```bash
npm run upload:env
```

## 3. Amplify IAM 역할에 S3 권한 추가
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::culture-chat-config/env/*"
    }
  ]
}
```

## 4. 배포 확인
- Amplify 빌드 로그에서 "Env loaded" 메시지 확인
- `/api/health` 엔드포인트로 환경변수 로드 상태 확인