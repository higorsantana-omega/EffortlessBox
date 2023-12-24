import { FileProvider } from "./FileProvider"
import { UploadProvider } from "./UploadProvider"
import { pipeline } from "node:stream/promises"
import express, { Response } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

export default app
