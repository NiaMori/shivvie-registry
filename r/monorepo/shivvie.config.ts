import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string(),
  }),

  async *actions({ i, a }) {
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
      from: '@:r/monorepo/j/release',
      to: '.',
    })

    yield a.shivvie({
      from: '@:r/pkg',
      to: '.',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'core',
      },
    })
  },
})
