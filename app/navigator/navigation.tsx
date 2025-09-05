'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={() => navigateTo('/')} className="text-xl font-bold hover:text-blue-200">
          CultureChat
        </button>
        <div className="space-x-4">
          <button 
            onClick={() => navigateTo('/')}
            className={`hover:text-blue-200 ${pathname === '/' ? 'font-semibold' : ''}`}
          >
            새 채팅
          </button>
          <button 
            onClick={() => navigateTo('/chat-list')}
            className={`hover:text-blue-200 ${pathname === '/chat-list' ? 'font-semibold' : ''}`}
          >
            채팅 목록
          </button>
        </div>
      </div>
    </nav>
  )
}