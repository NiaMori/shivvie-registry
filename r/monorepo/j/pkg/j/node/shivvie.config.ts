import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({
      names: ['@types/node'],
      dev: true,
    })

    yield a.manipulate('tsconfig.json', {
      path: 'tsconfig.json',
      manipulator: (tsconfig) => {
        tsconfig.compilerOptions ||= {}
        tsconfig.compilerOptions.types ||= []

        if (!tsconfig.compilerOptions.types.includes('node')) {
          tsconfig.compilerOptions.types.push('node')
        }
      },
    })
  },
})
