import { pipeline } from 'node:stream/promises'
import fs from 'fs'
import path, { dirname } from "path"
import { fileURLToPath } from 'url'

import Busboy, { BusboyHeaders } from '@fastify/busboy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const downloadsPath = path.join(__dirname, '..', 'downloads')

export class UploadProvider {
  private lastMessageSent: number = 0
  private messageDelay = 200

  constructor(
    private readonly io: any,
    private readonly socketId: any
  ) { }

  registerEvents(headers: any, onFinish: (response: unknown) => void) {
    const busboy = new Busboy({ headers: headers as BusboyHeaders })

     busboy.on('file', this.onFile.bind(this))
     busboy.on('finish', onFinish)

    return busboy
  }

  async onFile(fieldname: string, file: any, filename: string) {
    await pipeline(
      file,
      this.onFileBytes.apply(this, [filename]),
      fs.createWriteStream(`${downloadsPath}/${filename}`)
    )

    console.info(`File ${filename} saved`)
  }

  onFileBytes(filename: string) {
    this.lastMessageSent = Date.now()

    const handleData = async function*(this: UploadProvider, source: any) {
      let processed = 0;

      for await (const chunk of source) {
        yield chunk;

        processed += chunk.length;

        if (!this.canExecute(this.lastMessageSent)) {
          continue;
        }

        this.lastMessageSent = Date.now();
        this.io.to(this.socketId).emit('file-upload', { processed, filename });

        console.info(`file ${filename} got ${processed} bytes to ${this.socketId}`);
      }
    };

    return handleData.bind(this)
  }

  canExecute(lastExecution: number) {
    return (
      Date.now() - lastExecution
    ) >= this.messageDelay
  }
}
