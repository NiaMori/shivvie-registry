import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),

    features: z.object({
      rollup: z.boolean().optional(),
      node: z.boolean().optional(),
      eslint: z.boolean().optional(),
      vitest: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ i, a, r }) {
    const isMonorepo = !!i.repo
    const targetDir = isMonorepo
      ? `pkg/${i.name}`
      : '.'
    const packageName = isMonorepo
      ? r('@{{scope}}/{{repo}}.{{name}}')
      : r('@{{scope}}/{{name}}')
    const homepageUrl = isMonorepo
      ? r('https://github.com/{{scope}}/{{repo}}/pkg/{{name}}')
      : r('https://github.com/{{scope}}/{{name}}')

    yield a.cascade({
      from: 't',
      to: targetDir,
      additionalData: {
        packageName,
        homepageUrl,
      },
    })

    yield a.ni({ cwd: targetDir })

    const { features = {} } = i
    const { rollup = true, node = true, eslint = true, vitest = true } = features

    if (rollup) {
      yield a.shivvie({
        from: '@:r/rollup',
        to: targetDir,
      })
    }

    if (node) {
      yield a.shivvie({
        from: '@:r/node',
        to: targetDir,
      })
    }

    if (eslint) {
      yield a.shivvie({
        from: '@:r/eslint',
        to: targetDir,
      })
    }

    if (vitest) {
      yield a.shivvie({
        from: '@:r/vitest',
        to: targetDir,
      })
    }
  },
})
