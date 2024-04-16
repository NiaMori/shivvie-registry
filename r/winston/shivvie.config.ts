
import fs from 'node:fs'
import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'
import { findUp } from 'find-up'

export default defineShivvie({
  input: z.object({ }),

  async *actions({ a, p }) {
    yield a.ni({
      names: ['winston', 'luxon', '@types/luxon'],
    })

    const packageJsonPath = await findUp('package.json', {
      cwd: p.fromTarget('.'),
    }).then(it => z.string().parse(it))

    const packageJson = z.object({
      name: z.string(),
    }).parse(JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf-8')))

    yield a.render({
      from: 't/logger.ts',
      to: 'logger.ts',
      additionalData: {
        packageName: packageJson.name,
      },
    })
  },
})
