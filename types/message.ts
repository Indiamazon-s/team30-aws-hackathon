interface Message {
    id: string
    text: string
    timestamp: Date
    isReceived?: boolean
    feedback?: {
      type: 'warning' | 'good'
      message: string
      suggestion?: string
    }
  }