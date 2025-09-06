'use client'

import { useState, useEffect } from 'react'
import { Chat } from '../../types/chat'
import NewChatModal from './NewChatModal'

interface ChatListProps {
  onChatSelect: (chat: Chat) => void
  selectedChatId?: string
  currentUserEmail?: string
}

export default function ChatList({ onChatSelect, selectedChatId, currentUserEmail }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  const countries = [
    { code: 'US', name: '미국', flag: '🇺🇸' },
    { code: 'JP', name: '일본', flag: '🇯🇵' },
    { code: 'CN', name: '중국', flag: '🇨🇳' },
    { code: 'GB', name: '영국', flag: '🇬🇧' },
    { code: 'DE', name: '독일', flag: '🇩🇪' },
    { code: 'FR', name: '프랑스', flag: '🇫🇷' }
  ]

  useEffect(() => {
    loadChats()
  }, [currentUserEmail])

  const loadChats = async () => {
    if (!currentUserEmail) {
      console.log('currentUserEmail이 없어서 채팅 로드 스킵')
      setIsLoading(false)
      return
    }
    
    console.log('채팅 로드 시작:', currentUserEmail)
    try {
      const response = await fetch(`/api/chats?userEmail=${encodeURIComponent(currentUserEmail)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('채팅 로드 성공:', data.length, '개')
      setChats(data)
    } catch (error) {
      console.error('Failed to load chats:', error)
      setChats([]) // 오류 시 빈 배열로 설정
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChat = async (receiverEmail: string, relationship: string) => {
    console.log('=== 채팅 생성 시작 ===')
    console.log('currentUserEmail:', currentUserEmail)
    console.log('receiverEmail:', receiverEmail)
    console.log('relationship:', relationship)
    console.log('window.location.origin:', window.location.origin)
    
    if (!currentUserEmail) {
      console.error('사용자 이메일이 없음')
      alert('사용자 정보를 찾을 수 없습니다.')
      return
    }
    
    const requestData = {
      senderEmail: currentUserEmail,
      receiverEmail,
      relationship
    }
    console.log('요청 데이터:', requestData)
    
    try {
      console.log('API 호출 시작: /api/chat-request')
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://deploy.d1xcna90zqs5wl.amplifyapp.com'
        : window.location.origin
      
      console.log('Full URL:', `${baseUrl}/api/chat-request`)
      
      // API 엔드포인트 존재 확인
      console.log('API 엔드포인트 존재 확인 중...')
      const healthCheck = await fetch(`${baseUrl}/api/health`)
      console.log('Health check status:', healthCheck.status)
      
      if (!healthCheck.ok) {
        throw new Error('API 서버에 연결할 수 없습니다.')
      }
      
      // 인증 토큰 가져오기
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
      
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${baseUrl}/api/chat-request`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(requestData)
      })
      
      console.log('Response received:')
      console.log('- status:', response.status)
      console.log('- ok:', response.ok)
      console.log('- statusText:', response.statusText)
      console.log('- headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP 에러 응답 텍스트:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('성공 응답 데이터:', data)
      
      if (data.success) {
        console.log('채팅방 생성 성공:', data.message)
        alert(data.message)
        console.log('채팅 목록 새로고침 시작')
        await loadChats()
        console.log('채팅 목록 새로고침 완료')
      } else {
        console.error('채팅 요청 실패 응답:', data)
        alert(data.error || '채팅 요청 실패')
      }
    } catch (error) {
      console.error('=== 채팅 생성 에러 ===')
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('Error message:', error instanceof Error ? error.message : String(error))
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
      console.error('Full error object:', error)
      
      alert('채팅 요청 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)))
    }
    
    console.log('=== 채팅 생성 종료 ===')
  }

  const getCountryFlag = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    return country ? country.flag : '🌍'
  }

  // 상대방 이메일 추출 함수
  const getOtherUserEmail = (chat: Chat) => {
    if (!currentUserEmail || !chat.participants) return chat.name
    return chat.participants.find(email => email !== currentUserEmail) || chat.name
  }

  // 관계 라벨 매핑
  const relationshipLabels: { [key: string]: string } = {
    'boss': '상사',
    'colleague': '동료', 
    'friend': '친구',
    'lover': '연인',
    'parent': '부모님',
    'stranger': '낯선 사람'
  }

  // 채팅방 표시 이름 생성
  const getChatDisplayName = (chat: Chat) => {
    const otherUserEmail = getOtherUserEmail(chat)
    const relationshipLabel = relationshipLabels[chat.relationship || 'friend'] || chat.relationship || 'friend'
    return `${otherUserEmail} (${relationshipLabel})`
  }

  if (isLoading) {
    return (
      <div className="w-80 bg-gray-50 border-r flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-50 border-r flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">채팅방</h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            + 새 채팅
          </button>
        </div>
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={handleCreateChat}
      />

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            채팅방이 없습니다.<br />
            새 채팅을 시작해보세요!
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCountryFlag(chat.country)}</span>
                    <h3 className="font-medium truncate">{getChatDisplayName(chat)}</h3>
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(chat.timestamp).toLocaleDateString()}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}