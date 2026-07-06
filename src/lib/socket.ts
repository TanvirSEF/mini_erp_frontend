import { io, type Socket } from 'socket.io-client'
import { env } from './env'
import { token } from './token'

export const createSocket = (): Socket | null => {
  const accessToken = token.get()
  if (!accessToken) return null

  const socket = io(env.apiUrl, {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
  })

  if (env.isDev) {
    socket.on('connect_error', (error: Error) =>
      console.error('socket', error.message)
    )
  }

  return socket
}
