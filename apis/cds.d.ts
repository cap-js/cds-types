export * from './core'  // FIXME v, and add test
export * from './server'
export * from './env'  // FIXME: remove wrapper v, allow additional keys v
export * from './models'
export * from './services'  // FIXME: missing type Transaction v, also all properties from this.db proxied
export * from './events'  // FIXME: get rid of .default v, missing @types/express v
export * from './utils'
export { log, debug } from './log'  // log.levels, log.Logger, log.
// FIXME: rename clashes to Linked.*
// export * from './csn'
export { test } from './test'  // nothing except for .test v
export * from './cqn'  // FIXME: everything missing? only exports marked as such should be exported (no, but @private)
export * as ql from './ql' // FIXME: remove cds_ql v, instead export to cds.ql v
export { QLExtensions } from './ql'  // cds-ql.ts test tries to import this from top level? Correct? Or ql.QLExtensions?

import * as ql from './ql'
declare global {
	// these provide the functionality from SELECT, INSERT, etc in the global facade
	const SELECT: ql.QL<any>['SELECT']
	const INSERT: ql.QL<any>['INSERT']
	const UPSERT: ql.QL<any>['UPSERT']
	const UPDATE: ql.QL<any>['UPDATE']
	const DELETE: ql.QL<any>['DELETE']
	const CREATE: ql.QL<any>['CREATE']
	const DROP: ql.QL<any>['DROP']

	// and these allow us to use them as type too, i.e. `const q: SELECT<Book> = ...`
	type SELECT<T> = ql.SELECT<T>
	type INSERT<T> = ql.INSERT<T>
	type UPSERT<T> = ql.UPSERT<T>
	type UPDATE<T> = ql.UPDATE<T>
	type DELETE<T> = ql.DELETE<T>
	type CREATE<T> = ql.CREATE<T>
	type DROP<T>   = ql.DROP<T>
}