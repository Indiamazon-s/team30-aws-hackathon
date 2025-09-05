'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../navigator/navigation'
import { Chat } from '../../types/chat'


export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newChatName, setNewChatName] = useState('')
  const [newChatCountry, setNewChatCountry] = useState('US')

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats/list')
      if (response.ok) {
        const chatData = await response.json()
        setChats(chatData)
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    }
  }
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      US: '🇺🇸',
      JP: '🇯🇵',
      FR: '🇫🇷',
      DE: '🇩🇪',
      CN: '🇨🇳',
      GB: '🇬🇧'
    }
    return flags[country] || '🌍'
  }


  // 채팅 추가 함수
  const handleAddChat = async () => {
    // 채팅방 이름이 비어 있으면 패스
    if (!newChatName.trim()) return
    
    try {
      // 백엔드 서버로 api 호출
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChatName, country: newChatCountry })
      })
      
      if (response.ok) {
        const newChat = await response.json()
        setChats([newChat, ...chats])
        setShowModal(false)
        setNewChatName('')
        setNewChatCountry('US')
      } else {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        alert(`오류: ${errorData.details || errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to add chat:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">채팅 목록</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>+</span> 채팅 추가
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCountryFlag(chat.country)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{chat.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {chat.timestamp}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">새 채팅 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="채팅방 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">국가</label>
                <select
                  value={newChatCountry}
                  onChange={(e) => setNewChatCountry(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="US">🇺🇸 미국</option>
                  <option value="JP">🇯🇵 일본</option>
                  <option value="FR">🇫🇷 프랑스</option>
                  <option value="DE">🇩🇪 독일</option>
                  <option value="CN">🇨🇳 중국</option>
                  <option value="GB">🇬🇧 영국</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddChat}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}