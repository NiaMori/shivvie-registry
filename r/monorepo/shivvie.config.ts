import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string(),
  }),

  async *actions({ i, a, u }) {
    yield a.cascade({
      from: 't',
      to: '.',
      ignore: [
        'node_modules',
        '.gitignore.hbs',
      ],
    })

    yield a.render({
      from: 't/.gitignore.hbs',
      to: '.gitignore',
    })

    yield a.shivvie<typeof import('@:r/pnpm')>({
      from: '@:r/pnpm',
      to: '.',
    })

    yield a.ni()

    yield a.shivvie<typeof import('@:r/nx')>({
      from: '@:r/nx',
      to: '.',
    })

    yield a.shivvie<typeof import('@:r/release')>({
      from: '@:r/release',
      to: '.',
    })

    yield a.shivvie<typeof import('@:r/pkg/j/esmLib')>({
      from: '@:r/pkg/j/esmLib',
      to: 'pkg/core',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'core',
      },
    })

    yield a.render({
      from: await u.temp.write('index.ts', 'export const theAnswer = 42'),
      to: 'pkg/core/src/index.ts',
    })
  },
})
