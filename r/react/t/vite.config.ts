import { defineConfig } from 'vite'
import createReactPlugin from '@vitejs/plugin-react'
import createPagesPlugin from 'vite-plugin-pages'

export default defineConfig({
  build: {
    target: 'esnext',
  },

  resolve: {
    alias: [
      { find: '@', replacement: new URL('src', import.meta.url).pathname },
    ],
  },

  plugins: [
    createReactPlugin({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
    }),

    createPagesPlugin({
      dirs: [{ dir: 'src/routing', baseRoute: '' }],
      extensions: ['tsx'],
      importMode: 'sync',
      routeStyle: 'remix',
    }),
  ],
})
