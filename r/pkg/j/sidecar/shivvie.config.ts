import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),
  }),

  async *actions({ a, i }) {
    yield a.shivvie<typeof import('@:r/pkg/j/cjsApp')>({
      from: '@:r/pkg/j/cjsApp',
      to: '.',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: i.name,
      },
    })

    yield a.cascade({
      from: 't/src',
      to: './src',
    })
    yield a.ni({ names: ['express', 'zod'] })
    yield a.ni({ names: ['@types/express'], dev: true })

    yield a.shivvie<typeof import('@:r/sea')>({
      from: '@:r/sea',
      to: '.',
    })
  },
})
