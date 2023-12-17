import { Readable, Writable, Transform } from 'node:stream'

export class TestUtils {
  static genReadableStream(data) {
    return new Readable({
      read() {
        data.forEach(d => {
          this.push(d)
        })

        this.push(null)
      }
    })
  }

  static genWritableStream(onData) {
    return new Writable({
      write(chunk, enconding, cb) {
        onData(chunk)

        cb(null)
      }
    })
  }

  static genTransformStream(onData) {
    return new Transform({
      transform(chunk, enconding, cb) {
        onData(chunk)

        cb(null, chunk)
      }
    })
  }
}