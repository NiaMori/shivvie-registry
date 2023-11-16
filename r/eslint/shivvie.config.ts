import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'
import * as R from 'ramda'
import { fs } from 'zx'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a, p }) {
    yield a.ni({
      names: ['eslint', '@niamori/eslint-config'],
      dev: true,
    })

    const pkgJson = R.pipe(
      () => fs.readFileSync(p.fromTarget('package.json'), 'utf-8'),
      JSON.parse,
      z.object({
        type: z.enum(['module', 'commonjs']).optional().default('commonjs'),
      }).parse,
    )()

    if (pkgJson.type == 'module') {
      yield a.render({
        from: 't/eslint.config.mjs',
        to: 'eslint.config.js',
      })
    } else {
      yield a.render({
        from: 't/eslint.config.cjs',
        to: 'eslint.config.js',
      })
    }

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.scripts ||= {}
        pkg.scripts.lint ||= 'eslint .'
      },
    })
  },
})
