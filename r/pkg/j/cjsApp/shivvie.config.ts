import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),

    feat: z.object({
      rollup: z.boolean().optional(),
      eslint: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ i, a }) {
    const { feat = {} } = i
    const { rollup = true, eslint = true } = feat

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

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.type = 'commonjs'
      },
    })

    yield a.shivvie<typeof import('@:r/tsconfig')>({
      from: '@:r/tsconfig',
      to: '.',
      inputData: {
        cjs: true,
      },
    })

    if (rollup) {
      yield a.shivvie<typeof import('@:r/rollup')>({
        from: '@:r/rollup',
        to: '.',
        inputData: {
          preset: 'cjsApp',
        },
      })
    }

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
