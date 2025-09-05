'use client'

import { useState, useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import MannerFeedback from './MannerFeedback'
import TranslationHistory, { addToHistory } from './TranslationHistory'
import { Language, getTranslation } from '../lib/i18n'

interface ChatInterfaceProps {
  targetCountry: string
  language: Language
  selectedCountry: string
  chatId: string
}

export default function ChatInterface({ targetCountry, language, chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const userId = 'user-' + Math.random().toString(36).substr(2, 9)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showCopyToast, setShowCopyToast] = useState(false)

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?chatId=${chatId}`)
      if (response.ok) {
        const data = await response.json()
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          timestamp: new Date(msg.timestamp),
          isReceived: msg.userId !== userId,
          feedback: msg.feedback
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    fetchMessages()
    
    wsRef.current = new WebSocket('ws://localhost:8080')
    
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        type: 'join',
        userId,
        chatId
      }))
    }

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
  }, [chatId, userId])

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setShowCopyToast(true)
      setTimeout(() => {
        setCopiedId(null)
        setShowCopyToast(false)
      }, 1500)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  const t = (key: keyof typeof import('../lib/i18n').translations.ko) => 
    getTranslation(language, key)

  const handleSendMessage = async (text: string) => {
    try {
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
        <p className="text-blue-100">메시지를 입력하면 문화적 매너를 체크해드립니다</p>
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
              <MannerFeedback feedback={message.feedback} language={language} />
            )}
          </div>
        ))}
      </div>
      
      <MessageInput
        value={currentInput}
        onChange={setCurrentInput}
        onSend={handleSendMessage}
        targetCountry={targetCountry}
        language={language}
      />
      
      <TranslationHistory language={language} />
      
      {showCopyToast && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          복사 완료! 📋
        </div>
      )}
    </div>
  )
}