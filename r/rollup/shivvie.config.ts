import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({ names: ['rollup', '@niamori/rollup-config'], dev: true })

    yield a.render({
      from: 't/rollup.config.ts',
      to: 'rollup.config.ts',
    })

    yield a.manipulate('package.json', {
      path: 'package.json',

      manipulator(pkg) {
        pkg.exports ||= {
          '.': {
            import: './dist/esm/src/index.js',
            require: './dist/esm/src/index.js',
          },
          './*': {
            [`dev:${pkg.name}`]: './src/*.js',
            import: './dist/esm/src/*.js',
            require: './dist/esm/src/*.js',
          },
        }
        pkg.main ||= './dist/esm/src/index.js'
        pkg.module ||= './dist/esm/src/index.js'
        pkg.types ||= 'index.d.ts'
        pkg.typesVersions ||= {
          '*': {
            '*': [
              './dist/esm/src/*',
            ],
          },
        }

        pkg.files ||= ['dist']

        pkg.scripts ||= {}
        pkg.scripts.build ||= 'rollup --config rollup.config.ts --configPlugin typescript'
        pkg.scripts.dev ||= 'pnpm build --watch'
      },
    })

    yield a.manipulate('tsconfig.json', {
      path: 'tsconfig.json',
      manipulator(tsconfig) {
        tsconfig.include ||= []
        if (!tsconfig.include.includes('rollup.config.ts')) {
          tsconfig.include.push('rollup.config.ts')
        }
      },
    })

    yield a.manipulate('.gitignore', {
      path: '.gitignore',
      touch: true,
      manipulator(ignores) {
        if (!ignores.includes('/dist')) {
          ignores.push('/dist')
        }
      },
    })
  },
})
