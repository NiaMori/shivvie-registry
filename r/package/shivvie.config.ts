import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({
    scope: z.string(),
    repo: z.string().optional(),
    name: z.string(),

    feat: z.object({
      publishing: z.boolean().optional(),
    }).optional(),
  }),

  async *actions({ a, i, r }) {
    const isMonorepo = !!i.repo

    yield a.render({
      from: 't/package.json',
      to: 'package.json',
      additionalData: {
        pkg: {
          name: isMonorepo ? r('@{{scope}}/{{repo}}.{{name}}') : r('@{{scope}}/{{name}}'),
          author: 'NiaMori <Hellc5261@gmail.com> (https://github.com/niamori)',
          license: 'MIT',
        },
      },
    })

    const { publishing = false } = i.feat ?? {}

    if (publishing) {
      const homepageUrl = isMonorepo
        ? r('https://github.com/{{scope}}/{{repo}}/pkg/{{name}}')
        : r('https://github.com/{{scope}}/{{name}}')

      yield a.manipulate('package.json', {
        path: 'package.json',
        manipulator: (pkg) => {
          pkg.private = false
          pkg.version = '0.0.0'
          pkg.homepage = homepageUrl
          pkg.publishConfig = {
            access: 'public',
            registry: 'https://registry.npmjs.org',
          }
        },
      })
    }

    if (!isMonorepo) {
      yield a.shivvie({
        from: '@:r/pnpm',
        to: '.',
      })
    }
  },
})
