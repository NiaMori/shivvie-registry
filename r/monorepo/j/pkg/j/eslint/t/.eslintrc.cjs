const path = require('node:path')

process.env.ESLINT_TSCONFIG = path.resolve(__dirname, 'tsconfig.json')

/** @type import('eslint').Linter.Config */
module.exports = {
  root: true,
  extends: '@niamori/eslint-config',
}
