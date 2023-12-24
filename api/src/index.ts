import { createServer } from 'http'
import { SocketHandler } from './SocketHandler'
import { Controller } from './Controller'
import app from './app'

function start() {
  const server = createServer(app)

  const socketHandler = new SocketHandler()
  socketHandler.setServer(server)

  const controller = new Controller(socketHandler)
  app.get('/', controller.getAll)
  app.post('/', controller.upload)

  server
    .listen(3000)
    .on('listening', () => {
      socketHandler.listen()
    })
}

start()

