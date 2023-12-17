import fastify from "fastify"
import fastifyIO from 'fastify-socket.io'
import { FileProvider } from "./FileProvider"

const app = fastify({ logger: true })

app.register(fastifyIO)

app.get('/', async (req, reply) => {
  app.io.emit('Hello io')
  
  const files = await FileProvider.getFilesStatus()
  reply.send(files)
})

export default app
