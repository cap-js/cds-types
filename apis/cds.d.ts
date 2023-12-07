export * from './core'
export * from './server'
export * from './env'
export * from './models'
export * from './services'
export * from './events'
export * from './utils'
export { log, debug } from './log'
// FIXME: rename clashes to Linked.*
// export * from './csn'
export { test } from './test'
export * from './cqn'
export * as ql from './ql'
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