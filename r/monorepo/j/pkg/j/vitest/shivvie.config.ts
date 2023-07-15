import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({
      names: ['vitest', '@vitest/coverage-v8', '@vitest/ui'],
      dev: true,
    })

    yield a.cascade({
      from: 't',
      to: '.',
    })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.scripts ||= {}
        pkg.scripts.test ||= 'vitest --run --coverage'
      },
    })

    yield a.manipulate('tsconfig.json', {
      path: 'tsconfig.json',
      manipulator(tsconfig) {
        tsconfig.include ||= []

        if (!tsconfig.include.includes('vitest.config.ts')) {
          tsconfig.include.push('vitest.config.ts')
        }

        if (!tsconfig.include.includes('test')) {
          tsconfig.include.push('test')
        }
      },
    })
  },
})
