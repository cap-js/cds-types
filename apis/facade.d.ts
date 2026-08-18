export * from './core'
export * from './server'
export * from './env'
export * from './models'
export * from './services'
export * from './events'
export * from './utils'
export * from './cqn'
export * from './global'
export * from './i18n'
export { log, debug } from './log'
export { test } from './test'

// API extractor cannot handle export * as ql from './ql', so split it into an import and an export statement
// The named `ql` const is a callable universal converter that also carries all QL class properties
import { ql } from './ql'
export { ql }
export { QLExtensions, ConstructedQuery, Query } from './ql'
export type { CXLRef, CXLVal, CXLExpr, CXLColumns, CXLExpand, CXLWhere, CXLOrderBy } from './ql'

import * as csn from './csn'
// clashes with linked and not really needed for consumers,
// so only available in namespaced form (same fix for rollup as above)
export { csn }

// trick to work around "delete" as reserved identifier
import { Service } from './services'
declare const delete_: Service['delete']
export { delete_ as delete }

export const version: string
export const home: string
export const root: string

type CliCommands = 'add' | 'build' | 'compile' | 'deploy' | 'import' | 'init' | 'serve' | (string & {})
/**
 * The parsed effective `cds` CLI command and arguments.
 * May be undefined if not started from the `cds` CLI.
 * @see https://cap.cloud.sap/docs/node.js/cds-facade#cds-cli
 */
export const cli: {
  /** Basic command like `serve` */ command?: CliCommands,
  /** Positional arguments */       argv?: string[],
  /** Named arguments */            options?: Record<string, any>,
} | undefined


import { env } from './env'
export const requires: env.Requires

export * from '@sap/cds-dk'  // these only contribute types if the user has cds-dk installed
