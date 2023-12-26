import fs from 'node:fs'
import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import * as R from 'ramda'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a, p }) {
    const isMonorepoRoot = await fs.promises.access(p.fromTarget('pnpm-workspace.yaml')).then(() => true).catch(() => false)

    if (isMonorepoRoot) {
      yield a.ni({ names: ['bumpp'], dev: true })

      yield a.manipulate('package.json', {
        path: 'package.json',
        manipulator: (pkg) => {
          pkg.scripts ||= {}
          pkg.scripts.bump ||= `bumpp package.json ./pkg/*/package.json --no-push`
          pkg.scripts.release ||= 'pnpm bump && pnpm build && pnpm m exec publish'
        },
      })
    } else {
      yield a.ni({ names: ['bumpp'], dev: true })

      yield a.manipulate('package.json', {
        path: 'package.json',
        manipulator: (pkg) => {
          pkg.scripts ||= {}
          pkg.scripts.bump ||= 'bumpp --no-push'
          pkg.scripts.release ||= 'pnpm bump && pnpm build && pnpm publish'
        },
      })
    }
  },
})
