import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),

    feat: z.object({
      eslint: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ i, a }) {
    const { feat = {} } = i
    const { eslint = true } = feat

    yield a.shivvie({
      from: '@:r/package',
      to: '.',
      inputData: {
        scope: i.scope,
        name: i.name,
        repo: i.repo,
        feat: {
          publishing: false,
        },
      },
    })

    yield a.shivvie({
      from: '@:r/tsconfig',
      to: '.',
      inputData: {
        bundle: true,
        dom: true,
        jsx: true,
      },
    })

    yield a.shivvie({
      from: '@:r/react',
      to: '.',
    })

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
