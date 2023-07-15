import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({
      names: ['eslint', '@niamori/eslint-config'],
      dev: true,
    })

    yield a.render({
      from: 't/.eslintrc.cjs',
      to: '.eslintrc.cjs',
    })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.scripts ||= {}
        pkg.scripts.lint ||= 'eslint .'
      },
    })
  },
})
