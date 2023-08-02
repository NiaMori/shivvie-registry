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

    yield a.shivvie({
      from: '@:r/pnpm',
      to: '.',
    })

    yield a.ni()

    yield a.shivvie({
      from: '@:r/nx',
      to: '.',
    })

    yield a.shivvie({
      from: '@:r/release',
      to: '.',
    })

    yield a.shivvie({
      from: '@:r/pkg/j/lib',
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
