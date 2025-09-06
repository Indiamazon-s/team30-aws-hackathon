'use client'

import { useState } from 'react'

interface Alternative {
  text: string
  translatedText?: string
  reason: string
  formalityLevel: 'formal' | 'semi-formal' | 'casual'
}

interface AlternativeSelectorProps {
  alternatives: Alternative[]
  originalMessage: string
  targetCountry?: string
  userLanguage?: string // 사용자 언어 추가
  receiverLanguage?: string // 수신자 언어 추가
  onSelect: (selectedText: string, translatedText?: string) => void
  onCancel: () => void
}

const formalityLabels = {
  formal: '격식체',
  'semi-formal': '준격식체', 
  casual: '친근체'
}

const formalityColors = {
  formal: 'bg-blue-50 border-blue-200 text-blue-800',
  'semi-formal': 'bg-green-50 border-green-200 text-green-800',
  casual: 'bg-orange-50 border-orange-200 text-orange-800'
}

export default function AlternativeSelector({ 
  alternatives, 
  originalMessage,
  targetCountry,
  userLanguage = 'ko',
  receiverLanguage = 'en', 
  onSelect, 
  onCancel 
}: AlternativeSelectorProps) {
  
  const languageNames = {
    ko: '한국어', en: '영어', ja: '일본어', zh: '중국어',
    de: '독일어', fr: '프랑스어', hi: '힌디어',
    it: '이탈리아어', ru: '러시아어', pt: '포르투갈어'
  }
  
  const userLanguageName = languageNames[userLanguage as keyof typeof languageNames] || '내 언어'
  const receiverLanguageName = languageNames[receiverLanguage as keyof typeof languageNames] || '상대방 언어'
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🔄 더 나은 표현 제안
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 mb-2">원본 메시지:</p>
            <p className="text-red-800 font-medium">"{originalMessage}"</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              아래 대안 중 하나를 선택하세요:
            </p>
            
            {alternatives.map((alt, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedIndex === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${
                        formalityColors[alt.formalityLevel]
                      }`}>
                        {formalityLabels[alt.formalityLevel]}
                      </span>
                    </div>
                    <div className="space-y-2 mb-2">
                      {alt.text === alt.translatedText ? (
                        // 같은 언어일 때 하나로 표시
                        <div className="p-2 bg-blue-50 rounded border">
                          <p className="text-xs text-blue-600 mb-1">{userLanguageName}</p>
                          <p className="text-gray-900 font-medium">"{alt.text}"</p>
                        </div>
                      ) : (
                        // 다른 언어일 때 둘 다 표시
                        <>
                          <div className="p-2 bg-blue-50 rounded border">
                            <p className="text-xs text-blue-600 mb-1">{userLanguageName} (내 언어)</p>
                            <p className="text-gray-900 font-medium">"{alt.text}"</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded border">
                            <p className="text-xs text-green-600 mb-1">{receiverLanguageName} (상대방 언어)</p>
                            <p className="text-gray-900 font-medium">"{alt.translatedText}"</p>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {alt.reason}
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="radio"
                      name="alternative"
                      checked={selectedIndex === index}
                      onChange={() => setSelectedIndex(index)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                if (selectedIndex !== null) {
                  const selected = alternatives[selectedIndex]
                  onSelect(selected.text, selected.translatedText)
                }
              }}
              disabled={selectedIndex === null}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              선택한 표현 사용
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}