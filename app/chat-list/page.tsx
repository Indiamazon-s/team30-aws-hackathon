'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '../navigator/navigation'

interface Chat {
  id: string
  name: string
  country: string
  lastMessage: string
  timestamp: string
  unread: number
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'John Smith',
      country: 'US',
      lastMessage: 'Hello! How are you?',
      timestamp: '2024-01-15',
      unread: 2
    },
    {
      id: '2', 
      name: 'Yuki Tanaka',
      country: 'JP',
      lastMessage: 'ありがとうございます',
      timestamp: '2024-01-15',
      unread: 0
    },
    {
      id: '3',
      name: 'Marie Dubois',
      country: 'FR', 
      lastMessage: 'Bonjour!',
      timestamp: '2024-01-14',
      unread: 1
    }
  ])
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">채팅 목록</h1>
        
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
    </div>
  )
}