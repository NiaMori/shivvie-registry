import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'
import { $ } from 'zx'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a }) {
    yield a.zxFunction(async () => {
      await $`pnpm lint --fix`
    })
  },
})
