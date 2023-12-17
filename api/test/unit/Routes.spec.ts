import { describe, it, vi, expect } from 'vitest'
import fs from 'fs'
import { FileProvider } from '../../src/FileProvider'
import app from '../../src/app'

describe('Routes', () => {
  it('should list all files', async () => {
    const statMock = {
      dev: 66311,
      mode: 33204,
      nlink: 1,
      uid: 1000,
      gid: 1000,
      rdev: 0,
      blksize: 4096,
      ino: 1181041,
      size: 905014,
      blocks: 1768,
      atimeMs: 1702757905192.793,
      mtimeMs: 1671835213997.376,
      ctimeMs: 1702757915140.5825,
      birthtimeMs: 1702757905192.7937,
      atime: '2023-12-16T20:18:25.193Z',
      mtime: '2022-12-23T22:40:13.997Z',
      ctime: '2023-12-16T20:18:35.141Z',
      birthtime: '2023-12-16T20:18:25.193Z'
    }

    const mockUser = 'user'
    process.env.USER = mockUser

    const expected = [
      {
        size: '905 kB',
        lastModified: statMock.birthtime,
        owner: mockUser,
        file: 'file.jpg'
      }
    ]

    vi.spyOn(FileProvider, FileProvider.getFilesStatus.name as unknown as any)
      .mockResolvedValue(expected)

    const response = await app.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toEqual(JSON.stringify(expected))
  })
})
