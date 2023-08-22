import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a }) {
    yield a.ni({ names: ['nx'], dev: true })

    yield a.cascade({
      from: 't',
      to: '.',
    })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator: (pkg) => {
        pkg.scripts ||= {}
        pkg.scripts.build ||= 'nx run-many --target=build'
        pkg.scripts.dev ||= 'nx run-many --target=dev --output-style=stream --parallel 42'
        pkg.scripts.lint ||= 'nx run-many --target=lint'
        pkg.scripts.test ||= 'nx run-many --target=test'
      },
    })
  },
})
