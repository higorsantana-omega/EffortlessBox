import { Server as HttpServer } from 'http'
import { Server, Socket } from "socket.io";

export class SocketHandler {
  private server!: Server

  constructor () {}

  setServer(httpServer: HttpServer) {
    this.server = new Server(httpServer, {
      cors: { origin: '*'} 
    })
  }

  listen () {
    this.server.on('connection', (socket: Socket) => {
      console.info('someone connected' + socket.id)
    })
  }

  emit (socketId: string, data: any) {
    this.server
      .to(socketId)
      .emit('file-upload', { ...data })
  }
}