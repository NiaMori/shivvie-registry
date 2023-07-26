import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a }) {
    yield a.ni({ names: ['bumpp', 'syncpack'], dev: true })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator: (pkg) => {
        pkg.scripts ||= {}
        pkg.scripts.bump ||= 'bumpp package.json ./pkg/*/package.json --no-push --execute \'syncpack fix-mismatches --filter @niamori/shivvie.*\''
        pkg.scripts.release ||= 'pnpm build && pnpm bump && pnpm m exec npm publish'
      },
    })
  },
})
