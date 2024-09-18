export * from './core'
export * from './server'
export * from './env'
export * from './models'
export * from './services'
export * from './events'
export * from './utils'
export * from './cqn'
export * from './global'
export { log, debug } from './log'
export { test } from './test'

// API extractor cannot handle export * as ql from './ql', so split it into an import and an export statement
import * as ql from './ql'
export { ql }
export { QLExtensions } from './ql' // cds-ql.ts test tries to import this from top level? Correct? Or ql.QLExtensions?

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

/**
 * The parsed effective `cds` CLI command and arguments.
 * May be undefined if not started from the `cds` CLI.
 * @see https://cap.cloud.sap/docs/node.js/cds-facade#cds-cli
 */
export const cli: {
  /** Basic command like `serve` */ command?: string,
  /** Positional arguments */       argv?: string[],
  /** Named arguments */            options?: Record<string, any>,
} | undefined

import { env } from './env'
export const requires: env.Requires
