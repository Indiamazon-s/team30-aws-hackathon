'use client'

import './globals.css'
import { AuthProvider } from "react-oidc-context"
import { useEffect, useState } from 'react'

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const getRedirectUri = () => {
      if (process.env.NEXT_PUBLIC_REDIRECT) {
        return process.env.NEXT_PUBLIC_REDIRECT
      }
      if (typeof window !== 'undefined') {
        return window.location.origin
      }
      return 'http://localhost:3000'
    }

    const redirectUri = getRedirectUri()
    
    const cognitoAuthConfig = {
      authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_MmqEN1v7J",
      client_id: "7tplqpb2otcfcvltm51keauesk",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      automaticSilentRenew: false,
      includeIdTokenInSilentRenew: false,
      post_logout_redirect_uri: redirectUri + "/login",
      loadUserInfo: false,
      monitorSession: false,
      checkSessionInterval: 0
    }
    
    setConfig(cognitoAuthConfig)
  }, [])

  if (!config) {
    return <div>Loading...</div>
  }

  return <AuthProvider {...config}>{children}</AuthProvider>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  )
}