import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import { $ } from 'zx'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a }) {
    const pnpmVersion = (await $`pnpm -v`.quiet()).stdout.trim()

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator: (pkg) => {
        pkg.packageManager = `pnpm@${pnpmVersion}`
      },
    })
  },
})
