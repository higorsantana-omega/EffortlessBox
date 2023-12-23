import { describe, expect, it } from 'vitest'
import fs from 'fs'
import app from '../../src/app'
import { TestUtils } from '../@setup/TestUtils'
import { FormData } from 'formdata-node'

describe('routes', () => {
  it('should upload file to the folder', async () => {
    const filename = 'code.jpg'
    const fileStream = fs.createReadStream(`./test/integration/mocks/${filename}`)
    const responseStream = TestUtils.genWritableStream(() => {})

    const form = new FormData()
    form.append('image', fileStream)
    // const encoder = new FormDataEncoder(form)

    const response = await app.inject({
      method: 'POST',
      url: '?socketId=test',
      payload: form
    })

    expect(response.statusCode).toBe(200)
  })

  it('should list all files downloaded', async () => {

  })
})
