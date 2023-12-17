import fs from "fs"
import path, { dirname } from "path"
import prettyBytes from 'pretty-bytes'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const downloadsPath = path.join(__dirname, '..', 'downloads')

export class FileProvider {
  static async getFilesStatus () {
    const files = await fs.promises.readdir(downloadsPath)
    const filesRead = await Promise.all(
      files.map(
        file => fs.promises.stat(`${downloadsPath}/${file}`)
      )
    )

    const filesFormatted = []

    for (const fileIndex in files) {
      const { birthtime, size } = filesRead[fileIndex]

      filesFormatted.push({
        size: prettyBytes(size),
        file: files[fileIndex],
        lastModified: birthtime,
        owner: process.env.USER
      })
    }
  
    return filesFormatted
  }
}