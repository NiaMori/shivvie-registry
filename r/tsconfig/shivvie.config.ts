/* eslint-disable antfu/top-level-function */

import type { TSConfigJSON } from 'types-tsconfig'

import * as R from 'ramda'
import { type Draft, type Immutable, produce } from 'immer'
import { defineShivvie } from '@niamori/shivvie.core'
import { z } from 'zod'

import { mimic } from '@niamori/manipulator.json/mimic'
import { fs } from 'zx'

interface TSConfig extends Immutable<TSConfigJSON> {}
interface CompilerOptions extends Exclude<TSConfig['compilerOptions'], undefined> {}
type ProjectsOptions = Pick<CompilerOptions, 'incremental' | 'composite' | 'tsBuildInfoFile' | 'disableSourceOfProjectReferenceRedirect' | 'disableSolutionSearching' | 'disableReferencedProjectLoad'>
type LanguageAndEnvironmentOptions = Pick<CompilerOptions, 'target' | 'lib' | 'jsx' | 'experimentalDecorators' | 'emitDecoratorMetadata' | 'jsxFactory' | 'jsxFragmentFactory' | 'jsxImportSource' | 'reactNamespace' | 'noLib' | 'useDefineForClassFields' | 'moduleDetection'>
type ModulesOptions = Pick<CompilerOptions, 'module' | 'rootDir' | 'moduleResolution' | 'baseUrl' | 'paths' | 'rootDirs' | 'typeRoots' | 'types' | 'allowUmdGlobalAccess' | 'moduleSuffixes' | 'allowImportingTsExtensions' | 'resolvePackageJsonImports' | 'resolvePackageJsonExports' | 'customConditions' | 'resolveJsonModule' | 'allowArbitraryExtensions' | 'noResolve'>
type JavaScriptSupportOptions = Pick<CompilerOptions, 'allowJs' | 'checkJs' | 'maxNodeModuleJsDepth'>
type EmitOptions = Pick<CompilerOptions, 'declaration' | 'declarationMap' | 'emitDeclarationOnly' | 'sourceMap' | 'inlineSourceMap' | 'outFile' | 'outDir' | 'removeComments' | 'noEmit' | 'importHelpers' | 'importsNotUsedAsValues' | 'downlevelIteration' | 'sourceRoot' | 'mapRoot' | 'inlineSources' | 'emitBOM' | 'newLine' | 'stripInternal' | 'noEmitHelpers' | 'noEmitOnError' | 'preserveConstEnums' | 'declarationDir' | 'preserveValueImports'>
type InteropConstraintsOptions = Pick<CompilerOptions, 'isolatedModules' | 'verbatimModuleSyntax' | 'allowSyntheticDefaultImports' | 'esModuleInterop' | 'preserveSymlinks' | 'forceConsistentCasingInFileNames'>
type TypeCheckingOptions = Pick<CompilerOptions, 'strict' | 'noImplicitAny' | 'strictNullChecks' | 'strictFunctionTypes' | 'strictBindCallApply' | 'strictPropertyInitialization' | 'noImplicitThis' | 'useUnknownInCatchVariables' | 'alwaysStrict' | 'noUnusedLocals' | 'noUnusedParameters' | 'exactOptionalPropertyTypes' | 'noImplicitReturns' | 'noFallthroughCasesInSwitch' | 'noUncheckedIndexedAccess' | 'noImplicitOverride' | 'noPropertyAccessFromIndexSignature' | 'allowUnusedLabels' | 'allowUnreachableCode'>
type CompletenessOptions = Pick<CompilerOptions, 'skipLibCheck'>

const withInclude = () => (tsconfig: TSConfig): TSConfig => {
  return produce(tsconfig, (dr) => {
    dr.include = ['src']
  })
}

const withProjects = () => (options: CompilerOptions): CompilerOptions => {
  return options as ProjectsOptions satisfies CompilerOptions
}

const withLanguageAndEnvironment = (props: {
  dom?: boolean
  jsx?: boolean
} = {}) => (options: CompilerOptions): CompilerOptions => {
  const { dom = false, jsx = false } = props

  return produce(options, (dr: Draft<LanguageAndEnvironmentOptions>) => {
    dr.target = 'ESNext'
    dr.lib = ['ESNext']

    if (dom) {
      dr.lib.push('DOM')
      dr.lib.push('DOM.Iterable')
    }

    if (jsx) {
      dr.jsx = 'react-jsx'
      dr.jsxImportSource = '@emotion/react'
    }
  })
}

const withModules = (props: {
  bundle?: boolean
  withing?: (options: CompilerOptions) => CompilerOptions
} = {}) => (options: CompilerOptions): CompilerOptions => {
  const { bundle = false, withing = R.identity } = props

  const newOptions = produce(options, (dr: Draft<ModulesOptions>) => {
    dr.rootDir = '.'
    dr.types = ['node']

    if (bundle) {
      dr.module = 'ESNext'
      dr.moduleResolution = 'Bundler'
    } else {
      dr.module = 'NodeNext'
      dr.moduleResolution = 'NodeNext'
    }
  })

  return withing(newOptions)
}

const withJavaScriptSupport = () => (options: CompilerOptions): CompilerOptions => {
  return produce(options, (dr: Draft<JavaScriptSupportOptions>) => {
    dr.allowJs = false
  })
}

const withEmit = () => (compilerOptions: CompilerOptions): CompilerOptions => {
  return produce(compilerOptions, (dr: Draft<EmitOptions>) => {
    dr.noEmit = true
  })
}

const withInteropConstraints = () => (compilerOptions: CompilerOptions): CompilerOptions => {
  return produce(compilerOptions, (dr: Draft<InteropConstraintsOptions>) => {
    dr.isolatedModules = true
    dr.verbatimModuleSyntax = true
    dr.allowSyntheticDefaultImports = true
    dr.esModuleInterop = true
    dr.preserveSymlinks = false
    dr.forceConsistentCasingInFileNames = true
  })
}

const withTypeChecking = () => (compilerOptions: CompilerOptions): CompilerOptions => {
  return produce(compilerOptions, (dr: Draft<TypeCheckingOptions>) => {
    dr.strict = true
  })
}

const withCompleteness = () => (compilerOptions: CompilerOptions): CompilerOptions => {
  return produce(compilerOptions, (dr: Draft<CompletenessOptions>) => {
    dr.skipLibCheck = true
  })
}

const withCompilerOptions = (props: { withing?: (compilerOptions: CompilerOptions) => CompilerOptions } = {}) => (tsconfig: TSConfig): TSConfig => {
  const { withing = R.identity } = props

  return { ...tsconfig, compilerOptions: withing(tsconfig.compilerOptions ?? {}) }
}

const withAbsoluteImports = (props: { packageName: string }) => (options: CompilerOptions): CompilerOptions => {
  const { packageName } = props

  return produce(options, (dr: Draft<ModulesOptions>) => {
    if (dr.moduleResolution === 'Bundler') {
      dr.paths = {
        '@/*': ['./src/*'],
      }
    } else if (dr.moduleResolution === 'NodeNext') {
      dr.customConditions = [`dev:${packageName}`]
    }
  })
}

export default defineShivvie({
  input: z.object({
    bundle: z.boolean().optional(),
    dom: z.boolean().optional(),
    jsx: z.boolean().optional(),
  }),

  async *actions({ i, a, p, u }) {
    const { bundle = false, dom = false, jsx = false } = i

    const packageName = R.pipe(
      () => fs.readFileSync(p.fromTarget('package.json'), 'utf-8'),
      JSON.parse,
      z.object({ name: z.string() }).parse,
      R.prop('name'),
    )()

    const tsconfig = R.pipe(
      withInclude(),
      withCompilerOptions({
        withing: R.pipe(
          withProjects(),
          withLanguageAndEnvironment({ dom, jsx }),
          withModules({ bundle, withing: R.pipe(withAbsoluteImports({ packageName })) }),
          withJavaScriptSupport(),
          withEmit(),
          withInteropConstraints(),
          withTypeChecking(),
          withCompleteness(),
        ),
      }),
    )({})

    yield a.ni({ names: ['typescript', '@types/node'], dev: true })

    const tsconfigText = mimic(tsconfig, await fs.promises.readFile(p.fromSource('tsconfig.idol.json'), 'utf-8'))

    yield a.render({
      from: await u.temp.write('tsconfig.json', tsconfigText),
      to: 'tsconfig.json',
    })
  },
})
