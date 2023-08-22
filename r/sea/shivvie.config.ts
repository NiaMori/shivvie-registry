import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.ni({ names: ['pkg'], dev: true })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.scripts ||= {}

        // TODO: improve entry discovery
        const seaBuildScript = 'pkg dist/cjs/src/index.js -t host --out-path dist/sea/'

        if (pkg.scripts.build) {
          pkg.scripts.build = `${pkg.scripts.build} && ${seaBuildScript}`
        } else {
          pkg.scripts.build = seaBuildScript
        }
      },
    })
  },
})
