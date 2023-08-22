import express from 'express'
import { z } from 'zod'

const app = express()

app.get('/', (req, res) => {
  res.json({
    Hello: 'World',
  })
})

const port = z.object({
  TAURI_PROD_SIDECAR_NODE_PORT: z.coerce.number().optional(),
}).parse(process.env).TAURI_PROD_SIDECAR_NODE_PORT ?? 4090

app.listen(port, () => {
  process.stdout.write(`the sidecar server is running on http://localhost:${port}\n`)
})
