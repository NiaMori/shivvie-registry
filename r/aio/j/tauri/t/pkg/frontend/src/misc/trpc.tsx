import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client'
import { z } from 'zod'
import type { AppRouter } from '@{{{scope}}}/{{{repo}}}.sidecar/src/router'

async function getUrlFromTauri() {
  const { invoke } = await import('@tauri-apps/api')

  const { port } = await invoke('get_sidecar_node_meta').then(z.object({
    port: z.number(),
  }).parse)

  return `ws://localhost:${port}/trpc`
}

const trpcUrl = '__TAURI__' in window ? await getUrlFromTauri() : 'ws://localhost:4090/trpc'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: createWSClient({
        url: trpcUrl,
      }),
    }),
  ],
})
