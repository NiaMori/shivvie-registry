import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),

    feat: z.object({
      publishing: z.boolean().optional(),
      rollup: z.boolean().optional(),
      eslint: z.boolean().optional(),
      vitest: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ i, a }) {
    const { feat = {} } = i
    const { rollup = true, eslint = true, vitest = true, publishing = false } = feat

    yield a.shivvie({
      from: '@:r/package',
      to: '.',
      inputData: {
        scope: i.scope,
        name: i.name,
        repo: i.repo,
        feat: {
          publishing,
        },
      },
    })

    yield a.shivvie({
      from: '@:r/tsconfig',
      to: '.',
    })

    if (rollup) {
      yield a.shivvie({
        from: '@:r/rollup',
        to: '.',
      })
    }

    if (vitest) {
      yield a.shivvie({
        from: '@:r/vitest',
        to: '.',
      })
    }

    if (eslint) {
      yield a.shivvie({
        from: '@:r/eslint',
        to: '.',
      })

      yield a.shivvie({
        from: '@:r/eslint/j/lint',
        to: '.',
      })
    }
  },
})
