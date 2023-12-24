import { FileProvider } from "./FileProvider"
import { UploadProvider } from "./UploadProvider"
import { pipeline } from "node:stream/promises"
import { Request, Response } from "express"
import { SocketHandler } from "./SocketHandler"

export class Controller {
  constructor (
    private socketHandler: SocketHandler
  ) {}

  async getAll(request: Request, response: Response) {
    const files = await FileProvider.getFilesStatus()
    response.send(files)
  }

  async upload (request: Request, response: Response) {
    const { socketId } = request.query as any

    const uploadProvider = new UploadProvider(
      this.socketHandler,
      socketId
    )

    const onFinish = (response: Response) => () => {
      response.send({ result: 'Uploaded with success' })
    }

    const uploadInstance = uploadProvider.registerEvents(
      request.headers,
      onFinish(response)
    )

    await pipeline(
      request,
      uploadInstance
    )
  }
}