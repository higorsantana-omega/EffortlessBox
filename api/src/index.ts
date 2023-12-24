import { createServer } from 'http'
import { SocketHandler } from './SocketHandler'
import app from './app'
import { Controller } from './Controller'

function start () {
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

