import { z } from 'zod'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import fastifyCorsPlugin from '@fastify/cors'
import fastifyWebsocketPlugin from '@fastify/websocket'
import { appRouter } from '@/router'

async function main() {
  const port = z.object({
    TAURI_PROD_SIDECAR_NODE_PORT: z.coerce.number().optional(),
  }).parse(process.env).TAURI_PROD_SIDECAR_NODE_PORT ?? 4090

  const server = fastify({
    maxParamLength: 5000,
  })

  await server.register(fastifyCorsPlugin, {
    origin: ['http://localhost:5173', 'tauri://localhost'],
  })

  await server.register(fastifyWebsocketPlugin)

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWSS: true,
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  })

  await server.listen({ port })

  process.stdout.write(`the sidecar(node) server is running on http://localhost:${port}\n`)
}

main()
