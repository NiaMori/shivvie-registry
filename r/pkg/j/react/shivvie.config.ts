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

    yield a.shivvie<typeof import('@:r/package')>({
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

    yield a.shivvie<typeof import('@:r/tsconfig')>({
      from: '@:r/tsconfig',
      to: '.',
      inputData: {
        bundle: true,
        dom: true,
        jsx: true,
      },
    })

    yield a.shivvie<typeof import('@:r/react')>({
      from: '@:r/react',
      to: '.',
    })

    if (eslint) {
      yield a.shivvie<typeof import('@:r/eslint')>({
        from: '@:r/eslint',
        to: '.',
      })

      yield a.shivvie<typeof import('@:r/eslint/j/lint')>({
        from: '@:r/eslint/j/lint',
        to: '.',
      })
    }
  },
})
