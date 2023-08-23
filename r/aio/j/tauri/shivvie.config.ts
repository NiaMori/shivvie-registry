import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string(),
  }),

  async *actions({ a, i }) {
    yield a.shivvie<typeof import('@:r/monorepo')>({
      from: '@:r/monorepo',
      to: '.',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        feat: {
          core: false,
        },
      },
    })

    yield a.shivvie<typeof import('@:r/pkg/j/react')>({
      from: '@:r/pkg/j/react',
      to: 'pkg/frontend',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'frontend',
      },
    })

    yield a.shivvie<typeof import('@:r/pkg/j/sidecar')>({
      from: '@:r/pkg/j/sidecar',
      to: 'pkg/sidecar',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'sidecar',
      },
    })

    yield a.shivvie<typeof import('@:r/pkg/j/tauri')>({
      from: '@:r/pkg/j/tauri',
      to: 'pkg/tauri',
      inputData: {
        scope: i.scope,
        repo: i.repo,
        name: 'tauri',
      },
    })

    yield a.manipulate('package.json', {
      path: 'pkg/tauri/package.json',
      manipulator(pkg) {
        pkg.dependencies ||= {}

        pkg.dependencies[`@${i.scope}/${i.repo}.frontend`] = 'workspace:*'
        pkg.dependencies[`@${i.scope}/${i.repo}.sidecar`] = 'workspace:*'
      },
    })

    yield a.manipulate('package.json', {
      path: 'pkg/frontend/package.json',
      manipulator(pkg) {
        pkg.dependencies ||= {}

        pkg.dependencies[`@${i.scope}/${i.repo}.sidecar`] = 'workspace:*'
      },
    })

    yield a.ni()

    yield a.ni({ names: ['@tauri-apps/api'], cwd: 'pkg/frontend' })
    yield a.ni({ names: ['@trpc/client', '@trpc/server', 'zod'], cwd: 'pkg/frontend' })
    yield a.render({
      from: 't/pkg/frontend/src/misc/trpc.tsx',
      to: 'pkg/frontend/src/misc/trpc.tsx',
    })

    yield a.manipulate('json', {
      path: '.vscode/settings.json',

      manipulator(vscSettings) {
        vscSettings['rust-analyzer.linkedProjects'] = [
          './pkg/tauri/Cargo.toml',
        ]
      },
    })
  },
})
