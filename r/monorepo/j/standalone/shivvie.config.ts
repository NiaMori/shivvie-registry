import { defineShivvie } from '@niamori/shivvie.core'
import z from 'zod'
import * as R from 'ramda'
import { fs } from 'zx'

export default defineShivvie({
  input: z.object({}),

  async *actions({ a, p }) {
    const pkgJson = R.pipe(
      () => fs.readFileSync(p.fromTarget('package.json'), 'utf-8'),
      JSON.parse,
      z.object({
        name: z.string(),
      }).parse,
    )()

    const match = /@(?<scope>\w+)\/(?<repo>\w+)[.](?<name>\w+)/.exec(pkgJson.name)

    if (!match || !match.groups) {
      throw new Error(`Invalid Package Name '${pkgJson.name}'`)
    }

    yield a.manipulate('package.json', {
      path: 'package.json',
      manipulator (dr) {
        dr.scripts ||= {}
        dr.scripts['standalone'] ||= `cd ../.. && test -f pnpm-workspace.yaml && pnpm deploy --filter='${pkgJson.name}' 'dist/${pkgJson.name}' --prod`
      }
    })
  },
})
