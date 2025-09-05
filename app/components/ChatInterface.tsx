'use client'

import { useState, useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import MannerFeedback from './MannerFeedback'

// 채팅 인터페이스 property
interface ChatInterfaceProps {
  selectedCountry: string
  chatId: string
}

// 채팅 인터페이스
export default function ChatInterface({ selectedCountry, chatId }: ChatInterfaceProps) {
  // 메시지들
  const [messages, setMessages] = useState<Message[]>([])
  // 현재 입력
  const [currentInput, setCurrentInput] = useState('')
  // 웹소켓 클라이언트 참조값
  const wsRef = useRef<WebSocket | null>(null)
  // 유저 아이디
  const userId = 'user-' + Math.random().toString(36).substr(2, 9)
  
  useEffect(() => {
    fetchMessages()
    
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
  }, [chatId])

  // 메시지 조회 함수(웹소켓과 별도로 DB에서 조회)
  const fetchMessages = async () => {
    try {
      // api 엔드포인트로 조회 요청
      console.log('[ChatInterface]chatId: ', chatId);
      const response = await fetch(`/api/messages?chatId=${chatId}`)
      console.log('response', response)
      // 응답 받기
      if (response.ok) {
        const data = await response.json()
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          timestamp: new Date(msg.timestamp),
          isReceived: msg.userId !== userId,
          feedback: msg.feedback
        }))
        // 메시지 상태 업데이트
        setMessages(formattedMessages)
        console.log('formattedMessages', formattedMessages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  // 현재 메시지 전송
  const handleSendMessage = async (text: string) => {
    try {
      // DB에 메시지 저장
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, text, userId })
      })
      
      if (response.ok) {
        const savedMessage = await response.json()
        const newMessage: Message = {
          id: savedMessage.id,
          text: savedMessage.text,
          timestamp: new Date(savedMessage.timestamp),
          isReceived: false
        }
        
        setMessages(prev => [...prev, newMessage])
        setCurrentInput('')
        
        // 웹소켓으로도 전송
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'message',
            message: text
          }))
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
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
              /* 송/수신 메시지는 여기서 관리됨. */
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


