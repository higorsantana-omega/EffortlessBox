import { pipeline } from 'node:stream/promises'

import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'

import { UploadProvider } from '../../src/UploadProvider'
import { TestUtils } from '../@setup/TestUtils'

describe('Upload', () => {
  const io = {
    emit: (event, message) => {},
    to: (id) => io
  }

  const socketId = 'test'

  const headers = {
    'content-type': 'multipart/form-data; boundary='
  }

  const chunks = ['chunk', 'data']

  it('should call onFile and onFinish functions', async () => {
    const uploadProvider = new UploadProvider(io, socketId)

    vi
      .spyOn(uploadProvider, uploadProvider.onFile.name as unknown as any)
      .mockResolvedValue({})

    const fn = vi.fn()
    const uploadInstance = uploadProvider.registerEvents(headers, fn)

    const readableStream = TestUtils.genReadableStream(chunks)

    uploadInstance.emit('file', 'fieldname', readableStream, 'file.jpg')
    uploadInstance.listeners('finish')[0].call({})

    expect(uploadProvider.onFile).toHaveBeenCalled()
    expect(fn).toHaveBeenCalled()
  })

  it('should save stream file on disk', async () => {
    const uploadProvider = new UploadProvider(io, socketId)

    const onData = vi.fn()
    const onTransform = vi.fn()

    vi
      .spyOn(fs, fs.createWriteStream.name as unknown as any)
      .mockImplementation(() => TestUtils.genWritableStream(onData))

    vi
      .spyOn(uploadProvider, uploadProvider.onFileBytes.name as unknown as any)
      .mockImplementation(() => TestUtils.genTransformStream(onTransform))

    await uploadProvider.onFile('image', TestUtils.genReadableStream(chunks), 'image.jpg')

    expect(onData.mock.calls.join()).toEqual(chunks.join())
    expect(onTransform.mock.calls.join()).toEqual(chunks.join())

    expect(fs.createWriteStream).toHaveBeenCalledWith(expect.stringContaining(`/downloads/image.jpg`))
  })

  it('should send bytes to client', async () => {
    vi.spyOn(io, io.to.name as unknown as any)
    vi.spyOn(io, io.emit.name as unknown as any)
    const onWrite = vi.fn()

    const uploadProvider = new UploadProvider(io, socketId)

    vi
      .spyOn(uploadProvider, uploadProvider.canExecute.name as unknown as any)
      .mockReturnValueOnce(true)

    const messages = ['chunk']

    const source = TestUtils.genReadableStream(messages)
    const target = TestUtils.genWritableStream(onWrite)

    await pipeline(
      source,
      uploadProvider.onFileBytes('file.jpg'),
      target
    )

    expect(io.to).toHaveBeenCalledTimes(messages.length)
    expect(io.emit).toHaveBeenCalledTimes(messages.length)

    expect(onWrite).toBeCalledTimes(messages.length)
    expect(onWrite.mock.calls.join()).toEqual(messages.join())
  })

  it('should return true when time is later specified delay', async () => {
    const uploadProvider = new UploadProvider(io, socketId)

    const before = TestUtils.getTimeFromDate('2023-12-01 00:00:00')
    const now = TestUtils.getTimeFromDate('2023-12-01 00:00:03')

    TestUtils.mockDateNow([now])

    const result = uploadProvider.canExecute(before)
    expect(result).toBeTruthy()
  })

  it('should return false when time isnt later specified delay', async () => {
    const uploadProvider = new UploadProvider(io, socketId)

    const before = TestUtils.getTimeFromDate('2023-12-01 00:00:01')
    const now = TestUtils.getTimeFromDate('2023-12-01 00:00:00')

    TestUtils.mockDateNow([now])

    const result = uploadProvider.canExecute(before)
    expect(result).toBeFalsy()
  })
})