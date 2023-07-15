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
      ],
    })

    yield a.ni()

    yield a.shivvie({
      from: 'j/pkg',
      to: '.',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'core',
      },
    })
  },
})
