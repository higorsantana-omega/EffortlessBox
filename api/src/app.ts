import fastify, { FastifyReply } from "fastify"
import fastifyIO from 'fastify-socket.io'
import fastifyMultipart from '@fastify/multipart'
import { FileProvider } from "./FileProvider"
import { UploadProvider } from "./UploadProvider"
import { pipeline } from "node:stream/promises"

const app = fastify({ logger: true })

app.register(fastifyIO)
app.register(fastifyMultipart)

app.get('/', async (req, reply) => {
  app.io.emit('Hello io')

  const files = await FileProvider.getFilesStatus()
  reply.send(files)
})

app.post('/', async (req, reply) => {
  const { socketId } = req.query as any
  console.log(req.files)
  const uploadProvider = new UploadProvider(
    app.io,
    socketId
  )

  const onFinish = (reply: FastifyReply) => () => {
    console.log('ja foi')
    reply.send({ result: 'Uploaded with success' })
  }

  const uploadInstance = uploadProvider.registerEvents(
    req.headers,
    onFinish(reply)
  )

  const parts = req.files()

  for await (const part of parts) {
    await pipeline(
      part.file,
      uploadInstance
    )
  }
})

export default app
