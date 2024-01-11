export * from './core'
export * from './server'
export * from './env'
export * from './models'
export * from './services'
export * from './events'
export * from './utils'
export { log, debug } from './log'
export { test } from './test'
export * from './cqn'

// FIXME: sort out what needs to be exported from csn/linked and under which namespace
// export { Association, CSN, Definition, Extension, Element, EntityElements, FQN, kinds } from './csn'
// export { Definitions, LinkedCSN, LinkedDefinition, LinkedAssociation, LinkedEntity, Filter, Visitor } from './linked'

// API extractor cannot handle export * as ql from './ql', so split it into an import and an export statement
import * as ql from './ql'
export { ql }
export { QLExtensions } from './ql' // cds-ql.ts test tries to import this from top level? Correct? Or ql.QLExtensions?

// trick to work around "delete" as reserved identifier
import { Service } from './services'
declare const delete_: Service['delete']
export { delete_ as delete }

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
	type DROP<T> = ql.DROP<T>
}
