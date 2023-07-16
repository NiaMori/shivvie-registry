import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({ names: ['tsup'], dev: true })

    yield a.render({
      from: 't/tsup.config.ts',
      to: 'tsup.config.ts',
    })

    yield a.manipulate('package.json', {
      path: 'package.json',

      manipulator(pkg) {
        pkg.exports ||= {
          '.': {
            types: './dist/index.d.ts',
            import: './dist/index.mjs',
          },
        }
        pkg.main ||= './dist/index.mjs'
        pkg.module ||= './dist/index.mjs'
        pkg.types ||= './dist/index.d.ts'
        pkg.typesVersions ||= {
          '*': {
            '*': ['./dist/*', './dist/index.d.ts'],
          },
        }
        pkg.files ||= ['dist']
        pkg.scripts ||= {}
        pkg.scripts.build ||= 'tsup'
        pkg.scripts.dev ||= 'tsup --watch'
      },
    })

    yield a.manipulate('tsconfig.json', {
      path: 'tsconfig.json',
      manipulator(tsconfig) {
        tsconfig.include ||= []
        if (!tsconfig.include.includes('tsup.config.ts')) {
          tsconfig.include.push('tsup.config.ts')
        }
      },
    })
  },
})
