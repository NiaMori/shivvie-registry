import fs from 'node:fs'
import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import * as R from 'ramda'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a, p }) {
    const isMonorepoRoot = await fs.promises.access(p.fromTarget('pnpm-workspace.yaml')).then(() => true).catch(() => false)

    if (isMonorepoRoot) {
      yield a.ni({ names: ['bumpp', 'syncpack'], dev: true })

      const pkgJson = R.pipe(
        () => fs.readFileSync(p.fromTarget('package.json'), 'utf-8'),
        JSON.parse,
        z.object({
          name: z.string(),
        }).parse,
      )()

      const scope = pkgJson.name.split('/')[0].slice(1)
      const repo = pkgJson.name.split('/')[1].split('.')[0]

      yield a.manipulate('package.json', {
        path: 'package.json',
        manipulator: (pkg) => {
          pkg.scripts ||= {}
          pkg.scripts.bump ||= `bumpp package.json ./pkg/*/package.json --no-push --execute \'syncpack fix-mismatches --filter @${scope}/${repo}.*\'`
          pkg.scripts.release ||= 'pnpm bump && pnpm build && pnpm m exec npm publish'
        },
      })
    } else {
      yield a.ni({ names: ['bumpp'], dev: true })

      yield a.manipulate('package.json', {
        path: 'package.json',
        manipulator: (pkg) => {
          pkg.scripts ||= {}
          pkg.scripts.bump ||= 'bumpp --no-push'
          pkg.scripts.release ||= 'pnpm bump && pnpm build && npm run publish'
        },
      })
    }
  },
})
