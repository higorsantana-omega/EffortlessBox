import { FileProvider } from "./FileProvider"
import { UploadProvider } from "./UploadProvider"
import { pipeline } from "node:stream/promises"
import express, { Response } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.register(fastifyIO)
// app.register(fastifyMultipart)

app.get('/', async (req, reply) => {
  // app.io.emit('Hello io')

  const files = await FileProvider.getFilesStatus()
  reply.send(files)
})

app.post('/', async (req, response) => {
  const { socketId } = req.query as any

  const uploadProvider = new UploadProvider(
    {},
    socketId
  )

  const onFinish = (reply: Response) => () => {
    console.log('ja foi')
    reply.send({ result: 'Uploaded with success' })
  }

  const uploadInstance = uploadProvider.registerEvents(
    req.headers,
    onFinish(response)
  )

  await pipeline(
    req,
    uploadInstance
  )

  // const parts = req.()

  // for await (const part of parts) {
    
  // }
})

export default app
