import fs from 'node:fs'
import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import * as R from 'ramda'

export default defineShivvie({
  input: z.object({
    preset: z.enum(['esmLib', 'cjsApp']).default('esmLib'),
  }),

  async *actions({ i, a, u, p }) {
    const { preset } = i

    yield a.ni({ names: ['rollup', '@niamori/rollup-config'], dev: true })

    const pkgJson = R.pipe(
      () => fs.readFileSync(p.fromTarget('package.json'), 'utf-8'),
      JSON.parse,
      z.object({
        type: z.enum(['module', 'commonjs']).optional().default('commonjs'),
      }).parse,
    )()

    const rollupConfigSuffix = pkgJson.type === 'module' ? '.js' : '.mjs'
    const rollupConfigName = `rollup.config${rollupConfigSuffix}`

    yield a.render({
      from: await u.temp.write(rollupConfigName, `import { ${preset} } from '@niamori/rollup-config/presets'\n\nexport default await ${preset}()\n`),
      to: rollupConfigName,
    })

    if (preset === 'cjsApp') {
      yield a.manipulate('package.json', {
        path: 'package.json',

        manipulator(pkg) {
          pkg.main ||= './dist/cjs/src/index.js'

          pkg.scripts ||= {}
          pkg.scripts.build ||= `rollup --config ${rollupConfigName}`
          pkg.scripts.dev ||= `rollup --config ${rollupConfigName} --watch`
        },
      })
    } else if (preset === 'esmLib') {
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
          pkg.scripts.build ||= `rollup --config ${rollupConfigName}`
          pkg.scripts.dev ||= `rollup --config ${rollupConfigName} --watch`
        },
      })
    }

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
