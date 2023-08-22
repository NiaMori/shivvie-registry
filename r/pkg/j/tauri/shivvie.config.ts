import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import { $ } from 'zx'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string(),
    name: z.string(),

    meta: z.object({
      frontendDevPort: z.number().optional(),
      frontendDistDir: z.string().optional(),
      sidecarDistBinary: z.string().optional(),
    }).optional(),
  }),

  async *actions({ a, i, p }) {
    const { meta = {} } = i
    const {
      frontendDevPort = 5173,
      frontendDistDir = '../frontend/dist',
      sidecarDistBinary = '../sidecar/dist/sae/index',
    } = meta

    yield a.cascade({
      from: 't',
      to: '.',
      ignore: ['node_modules', 'package.json', 'target', 'Cargo.lock', 'icons'],
      additionalData: {
        frontendDevPort,
        frontendDistDir,
        sidecarDistBinary,
      },
    })

    yield a.zxFunction(async () => {
      await $`mkdir -p ${p.fromTarget('icons')}`
      await $`wget https://picsum.photos/1024 -O ${p.fromTarget('icons/app-icon.jpg')}`
      await $`cargo tauri icon ${p.fromTarget('icons/app-icon.jpg')} -o ${p.fromTarget('icons')}`
    })

    yield a.shivvie<typeof import('@:r/package')>({
      from: '@:r/package',
      to: '.',
      inputData: {
        scope: i.scope,
        name: i.name,
        repo: i.repo,
        feat: {
          publishing: false,
        },
      },
    })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator(pkg) {
        pkg.scripts ||= {}
        pkg.scripts.dev ||= 'cargo tauri dev'
        pkg.scripts.build ||= 'cargo tauri build'
      },
    })

    yield a.ni({ names: ['zx'], dev: true })
  },
})
