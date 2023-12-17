import { Readable, Writable, Transform } from 'node:stream'
import { vi } from 'vitest'

export class TestUtils {
  static genReadableStream(data) {
    return new Readable({
      read() {
        for (const d of data) {
          this.push(d) 
        }

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

  static getTimeFromDate (dateString: string) {
    return new Date(dateString).getTime()
  }

  static mockDateNow (mockPeriods: number[]) {
    const now = vi.spyOn(global.Date, global.Date.now.name as unknown as any)
    mockPeriods.forEach(period => now.mockReturnValueOnce(period))
  }
}