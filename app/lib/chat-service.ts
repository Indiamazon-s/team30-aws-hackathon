import { PutCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamodb } from './dynamodb'
import { Chat } from '@/types/chat'

const CHATS_TABLE = 'CultureChat-Chats'
const MESSAGES_TABLE = 'CultureChat-Messages'

export const chatService = {
  async getChats(): Promise<Chat[]> {
    const command = new ScanCommand({
      TableName: CHATS_TABLE,
    })
    const result = await dynamodb.send(command)
    return result.Items as Chat[]
  },

  async createChat(chat: Omit<Chat, 'id'>): Promise<Chat> {
    const newChat: Chat = {
      id: Date.now().toString(),
      ...chat,
    }
    
    const command = new PutCommand({
      TableName: CHATS_TABLE,
      Item: newChat,
    })
    
    await dynamodb.send(command)
    return newChat
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const command = new QueryCommand({
      TableName: MESSAGES_TABLE,
      KeyConditionExpression: 'chatId = :chatId',
      ExpressionAttributeValues: {
        ':chatId': chatId,
      },
    })
    
    const result = await dynamodb.send(command)
    return result.Items as Message[]
  },

  async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString(),
      ...message,
    }
    
    const command = new PutCommand({
      TableName: MESSAGES_TABLE,
      Item: newMessage,
    })
    
    await dynamodb.send(command)
    return newMessage
  },
}