'use client'

import { useAuth } from "react-oidc-context"

export default function Login() {
  const auth = useAuth()

  const handleLogin = () => {
    auth.signinRedirect()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">CultureChat</h1>
        <p className="text-gray-600 mb-8">문화적 배려가 담긴 매너있는 채팅 서비스</p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
        >
          🔐 로그인 / 회원가입
        </button>
        <p className="text-sm text-gray-500 mt-4">
          AWS Cognito를 통한 안전한 로그인
        </p>
      </div>
    </div>
  )
}