import { NextRequest, NextResponse } from 'next/server'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { getCulturalData } from '../../data/culturalData'
import { withRetry, classifyError } from '../../utils/errorHandler'

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  requestHandler: {
    requestTimeout: 10000,
    connectionTimeout: 3000
  }
})

interface AlternativeAnalysisRequest {
  message: string
  targetCountry: string
  relationship: 'boss' | 'friend' | 'lover' | 'parent' | 'colleague' | 'stranger'
  language?: string
}

interface Alternative {
  text: string
  reason: string
  formalityLevel: 'formal' | 'semi-formal' | 'casual'
}

interface AlternativeAnalysisResponse {
  type: 'warning' | 'good'
  message: string
  culturalReason: string
  alternatives?: Alternative[]
  originalMessage?: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, targetCountry, relationship, language = 'ko' }: AlternativeAnalysisRequest = await request.json()
    
    const countryNames = {
      KR: '대한민국', US: '미국', JP: '일본', CN: '중국', 
      GB: '영국', DE: '독일', FR: '프랑스'
    }
    const countryName = countryNames[targetCountry as keyof typeof countryNames] || targetCountry
    const culturalData = getCulturalData(targetCountry)

    const relationshipContext = {
      boss: { ko: '상사', formality: 'high', respectLevel: 'maximum' },
      colleague: { ko: '동료', formality: 'medium', respectLevel: 'moderate' },
      friend: { ko: '친구', formality: 'low', respectLevel: 'minimal' },
      lover: { ko: '연인', formality: 'low', respectLevel: 'intimate' },
      parent: { ko: '부모님', formality: 'high', respectLevel: 'filial' },
      stranger: { ko: '낯선 사람', formality: 'medium', respectLevel: 'polite' }
    }

    const relationInfo = relationshipContext[relationship]

    const prompt = `당신은 문화적 매너 전문가입니다. 다음 메시지를 ${countryName} 문화권에서 ${relationInfo.ko}에게 보내는 것으로 분석해주세요.

메시지: "${message}"
대상 국가: ${countryName}
관계: ${relationInfo.ko}
예의 수준: ${relationInfo.respectLevel}
격식 수준: ${relationInfo.formality}

문화적 고려사항:
- 민감주제: ${culturalData?.sensitiveTopic.join(', ') || '없음'}
- 금기사항: ${culturalData?.taboos.join(', ') || '없음'}

${targetCountry === 'KR' ? 
  `한국 문화 특성: 존댓말과 높임법, 나이와 지위 기반 예의, 집단주의, 체면 중시, 완곡한 표현 선호
  관계별 언어 사용:
  - 상사: 극존댓말, "~습니다/~니다" 사용
  - 동료: 존댓말, "~해요" 사용  
  - 친구: 반말 가능, 친근한 표현
  - 연인: 애칭, 친밀한 표현
  - 부모님: 높임말, "~드립니다" 사용` : 
  '해당 국가의 문화적 특성과 관계별 적절한 표현 방식을 고려하세요.'}

분석 후 다음 JSON 형식으로 응답:

문제가 있는 경우:
{
  "type": "warning",
  "message": "구체적인 문제점 설명",
  "culturalReason": "문화적 이유",
  "alternatives": [
    {
      "text": "첫 번째 대안 (가장 격식있는 표현)",
      "reason": "선택 이유",
      "formalityLevel": "formal"
    },
    {
      "text": "두 번째 대안 (중간 격식 표현)",
      "reason": "선택 이유", 
      "formalityLevel": "semi-formal"
    },
    {
      "text": "세 번째 대안 (친근한 표현)",
      "reason": "선택 이유",
      "formalityLevel": "casual"
    }
  ],
  "originalMessage": "${message}"
}

문제가 없는 경우:
{
  "type": "good",
  "message": "👍 매너 굿! ${relationInfo.ko}에게 적절한 표현입니다.",
  "culturalReason": "적절한 이유"
}`

    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      }),
      contentType: 'application/json',
      accept: 'application/json',
    })

    const response = await withRetry(async () => {
      return await client.send(command)
    }, 2, 1000)
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    let result: AlternativeAnalysisResponse

    try {
      const rawText = responseBody.content[0].text.trim()
      const jsonStart = rawText.indexOf('{')
      const jsonEnd = rawText.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawText.substring(jsonStart, jsonEnd + 1)
        result = JSON.parse(jsonText)
      } else {
        throw new Error('No valid JSON found')
      }
    } catch (parseError) {
      result = {
        type: 'good',
        message: `👍 매너 굿! ${relationInfo.ko}에게 적절한 표현입니다.`,
        culturalReason: '기본 분석 결과입니다.'
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    const appError = classifyError(error)
    return NextResponse.json({
      type: 'good',
      message: '👍 매너 굿! 적절한 표현입니다.',
      culturalReason: '서비스 일시 장애로 기본 분석을 제공합니다.'
    })
  }
}