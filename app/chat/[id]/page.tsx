'use client'

// 각 채팅방
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navigation from '../../navigator/navigation'
import ChatInterface from '../../components/ChatInterface'


// 채팅 페이지 함수형 컴포넌트
export default function ChatPage() {
  // 파라메터
  const params = useParams()
  // 챗 ID
  const chatId = params.id as string
  const [chatInfo, setChatInfo] = useState<any>(null)

  useEffect(() => {
    fetchChatInfo()
  }, [chatId])

  const fetchChatInfo = async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setChatInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch chat info:', error)
    }
  }

  if (!chatInfo) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{chatInfo.name}</h1>
          <p className="text-gray-600">국가: {chatInfo.country}</p>
        </div>
        <ChatInterface selectedCountry={chatInfo.country} chatId={chatId}/>
      </div>
    </div>
  )
}