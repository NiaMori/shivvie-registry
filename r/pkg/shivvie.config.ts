import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string(),
    name: z.string(),

    features: z.object({
      tsup: z.boolean().optional(),
      node: z.boolean().optional(),
      eslint: z.boolean().optional(),
      vitest: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ i, a }) {
    yield a.cascade({
      from: 't',
      to: 'pkg/{{name}}',
    })

    yield a.ni()

    const { features = {} } = i
    const { tsup = true, node = true, eslint = true, vitest = true } = features

    if (tsup) {
      yield a.shivvie({
        from: '@:r/tsup',
        to: 'pkg/{{name}}',
      })
    }

    if (node) {
      yield a.shivvie({
        from: '@:r/node',
        to: 'pkg/{{name}}',
      })
    }

    if (eslint) {
      yield a.shivvie({
        from: '@:r/eslint',
        to: 'pkg/{{name}}',
      })
    }

    if (vitest) {
      yield a.shivvie({
        from: '@:r/vitest',
        to: 'pkg/{{name}}',
      })
    }
  },
})
