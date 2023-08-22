#!/usr/bin/env zx

import process from 'node:process'
import { $, fs, os } from 'zx'

const extension = os.platform === 'win32' ? '.exe' : ''

const rustInfo = await $`rustc -vV`.quiet().then(it => it.stdout)
const targetTriple = /host: (\S+)/g.exec(rustInfo)[1]
if (!targetTriple) {
  console.error('failed to determine platform target triple')
}

await fs.mkdir('./binaries', { recursive: true })

const dest = `./binaries/node-${targetTriple}${extension}`

if (process.env.NODE_ENV === 'production') {
  await fs.copyFile(new URL(`../../sidecar/dist/sea/index${extension}`, import.meta.url).pathname, dest)
} else {
  await $`touch ${dest}`
}
