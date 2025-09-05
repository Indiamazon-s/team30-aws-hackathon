'use client'

import { useState, useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import MannerFeedback from './MannerFeedback'

interface ChatInterfaceProps {
  selectedCountry: string
}

export default function ChatInterface({ selectedCountry }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const chatId = 'default-chat' // 임시 채팅 ID
  const userId = 'user-' + Math.random().toString(36).substr(2, 9)

  useEffect(() => {
    // 웹소켓 중개 서버 연결
    wsRef.current = new WebSocket('ws://localhost:8080')
    
    // join 요청을 먼저 보내서 클라이언트 등록
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        type: 'join',
        userId,
        chatId
      }))
    }

    // 웹소켓 현재 객체의 onmessage 함수 등록, ? 이게 뭐지?
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        const receivedMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          timestamp: new Date(data.timestamp),
          isReceived: true
        }
        setMessages(prev => [...prev, receivedMessage])
      }
    }

    return () => {
      wsRef.current?.close()
    }
  }, [])

  // 현재 메시지 전송
  const handleSendMessage = async (text: string) => {
    // 메시지 생성
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    }

    // 메시지 스테이트 설정
    setMessages(prev => [...prev, newMessage])
    setCurrentInput('')

    // 현재 참조 웹소켓 주소로 메시지 전송
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        message: text
      }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-500 text-white p-4">
        <h2 className="text-xl font-semibold">채팅 창</h2>
        <p className="text-blue-100">메시지를 입력하면 문화적 매너를 체크해드립니다 낄낄</p>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`p-3 rounded-lg max-w-xs ${
              message.isReceived ? 'bg-gray-100 mr-auto' : 'bg-blue-100 ml-auto'
            }`}>
              <p>{message.text}</p>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {message.feedback && (
              <MannerFeedback feedback={message.feedback} />
            )}
          </div>
        ))}
      </div>
      
      <MessageInput
        value={currentInput}
        onChange={setCurrentInput}
        onSend={handleSendMessage}
        targetCountry={selectedCountry}
      />
    </div>
  )
}


