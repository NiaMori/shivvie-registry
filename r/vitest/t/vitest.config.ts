import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: '{{packageName}}', replacement: new URL('src', import.meta.url).pathname },
    ],
  },
})
