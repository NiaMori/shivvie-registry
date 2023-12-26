import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

export default defineShivvie({
  input: z.object({}),

  async * actions({ a }) {
    yield a.ni({ names: ['react', 'react-dom', 'react-router-dom'] })
    yield a.ni({ names: ['@types/react', '@types/react-dom'], dev: true })

    yield a.ni({ names: ['vite', '@vitejs/plugin-react', 'vite-plugin-pages'] })

    yield a.ni({ names: ['@emotion/react'] })

    yield a.ni({
      names: [
        '@mantine/core',
        '@mantine/ds',
        '@mantine/hooks',
        '@mantine/notifications',
        '@mantine/prism',
      ],
    })

    yield a.ni({ names: ['@tabler/icons-react'] })

    yield a.cascade({
      from: 't',
      to: '.',
      ignore: [
        'node_modules',
        'dist',
        'package.json',
        'tsconfig.json',
        'pnpm-lock.yaml',
      ],
    })

    yield a.manipulate('tsconfig.json', {
      path: 'tsconfig.json',
      manipulator: (tsconfig) => {
        tsconfig.compilerOptions ||= {}
        tsconfig.compilerOptions.types ||= []

        for (const type of ['vite/client', 'vite-plugin-pages/client-react']) {
          if (!tsconfig.compilerOptions.types.includes(type)) {
            tsconfig.compilerOptions.types.push(type)
          }
        }

        tsconfig.include ||= []
        if (!tsconfig.include.includes('vite.config.ts')) {
          tsconfig.include.push('vite.config.ts')
        }
      }
    })

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator: (pkg) => {
        pkg.scripts ||= {}
        pkg.scripts.dev ||= 'vite --host'
        pkg.scripts.build ||= 'vite build'
      },
    })

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
