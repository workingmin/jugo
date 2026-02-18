/**
 * WebSocket连接封装
 * 支持自动重连、心跳检测
 */

import { WS_URL, WS_HEARTBEAT_INTERVAL, WS_RECONNECT_INTERVAL, MAX_RECONNECT_ATTEMPTS } from '@/config/constants'
import { getToken } from './storage'

export type WSMessageType = 'autosave' | 'autosave_ack' | 'ai_progress' | 'heartbeat' | 'error'

export interface WSMessage {
  type: WSMessageType
  [key: string]: any
}

export type WSMessageHandler = (message: WSMessage) => void

export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private messageHandlers: Map<WSMessageType, Set<WSMessageHandler>> = new Map()
  private isManualClose = false

  constructor(url?: string) {
    this.url = url || WS_URL
  }

  /**
   * 连接WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = getToken()
        if (!token) {
          reject(new Error('未登录'))
          return
        }

        const wsUrl = `${this.url}?token=${token}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('WebSocket message parse error:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket closed')
          this.stopHeartbeat()

          if (!this.isManualClose) {
            this.reconnect()
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 发送消息
   */
  send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.isManualClose = true
    this.stopHeartbeat()
    this.stopReconnect()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 注册消息处理器
   */
  on(type: WSMessageType, handler: WSMessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }
    this.messageHandlers.get(type)!.add(handler)
  }

  /**
   * 移除消息处理器
   */
  off(type: WSMessageType, handler: WSMessageHandler): void {
    const handlers = this.messageHandlers.get(type)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(message: WSMessage): void {
    const handlers = this.messageHandlers.get(message.type)
    if (handlers) {
      handlers.forEach((handler) => handler(message))
    }
  }

  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'heartbeat' })
    }, WS_HEARTBEAT_INTERVAL)
  }

  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * 重连
   */
  private reconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('WebSocket reconnect failed: max attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`WebSocket reconnecting... (${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('WebSocket reconnect error:', error)
      })
    }, WS_RECONNECT_INTERVAL)
  }

  /**
   * 停止重连
   */
  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// 创建全局WebSocket实例
let wsClient: WebSocketClient | null = null

export const getWSClient = (): WebSocketClient => {
  if (!wsClient) {
    wsClient = new WebSocketClient()
  }
  return wsClient
}

export default WebSocketClient
