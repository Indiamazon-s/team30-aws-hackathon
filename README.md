# Team 30 : CultureChat

문화적 배려가 담긴 매너있는 외국인 채팅 서비스

## 어플리케이션 개요

외국인과의 대화 중 발생할 수 있는 **문화적 오해나 실례**를 방지하기 위해, 채팅 입력 시 **해당 국가의 문화, 예절, 금기사항 등을 실시간 피드백**으로 제공하는 매너 챗봇 서비스입니다.

AWS Bedrock의 Claude 3 모델을 활용하여 실시간으로 메시지의 문화적 적절성을 분석하고, 사용자에게 즉각적인 피드백을 제공합니다.

## 주요 기능

### 1. 실시간 문화적 매너 분석
- 사용자가 입력한 메시지를 AWS Bedrock으로 실시간 분석
- 문화적으로 부적절한 표현 감지 시 경고 알림
- 적절한 표현일 경우 "👍매너 굿!" 피드백 제공

### 2. 국가별 맞춤 분석
- 대한민국, 미국, 일본, 중국, 영국, 독일, 프랑스 등 주요 국가 지원
- 각 국가의 문화적 특성을 고려한 개별화된 분석
- 국가별 금기사항 및 민감한 주제 필터링

### 3. 대안 표현 제안
- 부적절한 표현 감지 시 더 나은 대안 제시
- 문화적으로 안전한 표현으로의 변환 가이드
- 상황별 적절한 커뮤니케이션 방법 제안

### 4. 실시간 채팅 시스템
- WebSocket 기반 실시간 메시지 송수신
- 채팅방 생성 및 관리 기능
- DynamoDB를 통한 메시지 영구 저장
- 연결 상태 실시간 표시

### 5. 직관적인 사용자 인터페이스
- 실시간 채팅 형태의 친숙한 UI
- 시각적 피드백 (경고/승인 표시)
- 반응형 디자인으로 다양한 디바이스 지원

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, WebSocket Server (Node.js)
- **Database**: AWS DynamoDB
- **Real-time**: WebSocket (ws)
- **AI/ML**: AWS Bedrock (Claude 3 Sonnet)
- **Deployment**: AWS (예정)

## 새로운 기능: 실시간 채팅

### 웹소켓 기반 실시간 채팅
- 1:1 실시간 메시지 송수신
- 채팅방 생성 및 관리
- 메시지 히스토리 저장 (DynamoDB)
- 실시간 매너 분석 통합
- 연결 상태 표시

### 채팅 기능 사용법
1. 메인 페이지에서 "채팅 모드" 선택
2. 좌측 패널에서 "+ 새 채팅" 버튼 클릭
3. 채팅방 이름과 상대방 국가 선택
4. 실시간으로 메시지 주고받기
5. 부적절한 표현 감지 시 대안 제시

## 개발 및 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일에 AWS 자격증명을 설정하세요:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

### 3. DynamoDB 테이블 생성
```bash
npm run setup:db
```

### 4. 개발 서버 실행

#### 전체 서비스 실행 (Next.js + WebSocket)
```bash
npm run dev:full
```

#### 개별 실행
```bash
# Next.js 개발 서버
npm run dev

# WebSocket 서버 (별도 터미널)
npm run websocket
```

## 동영상 데모

*(개발 완료 후 추가 예정)*

## 리소스 배포하기

### AWS 배포 아키텍처
- **Frontend**: AWS Amplify 또는 Vercel
- **API**: AWS Lambda + API Gateway
- **AI 서비스**: AWS Bedrock
- **모니터링**: AWS CloudWatch

### 배포 명령어
```bash
# 빌드
npm run build

# 배포 (설정 후)
npm run deploy
```

### 리소스 삭제
```bash
npm run destroy
```

## 프로젝트 기대 효과 및 예상 사용 사례

### 기대 효과
- **문화적 갈등 예방**: 무의식적인 문화적 실수로 인한 오해 방지
- **글로벌 커뮤니케이션 향상**: 더 원활하고 존중받는 국제적 대화 촉진
- **문화적 인식 개선**: 사용자의 다문화 이해도 향상

### 예상 사용 사례
- **비즈니스**: 해외 클라이언트와의 이메일/메신저 커뮤니케이션
- **교육**: 어학원, 대학교의 국제 교류 프로그램
- **개인**: 해외 친구, SNS, 온라인 게임에서의 소통
- **여행**: 해외 여행 중 현지인과의 대화
- **취업**: 외국계 기업 면접 및 업무 커뮤니케이션
