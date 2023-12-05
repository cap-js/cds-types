import * as ql from './ql'

declare global {
	const cds : cds_facade
}

export = cds

type cds_facade = {}
& import('./core').default
& import('./env').default
& import('./models').default
& import('./server').default
& import('./services').QueryAPI
& import('./services').default
& import('./events').default
& import('./ql').cds_ql
& import('./log')
& import('./utils')
& import('./test')

declare global {
	// these provide the functionality from SELECT, INSERT, etc in the global facade
	const SELECT: typeof cds.ql.SELECT
	const INSERT: typeof cds.ql.INSERT
	const UPSERT: typeof cds.ql.UPSERT
	const UPDATE: typeof cds.ql.UPDATE
	const DELETE: typeof cds.ql.DELETE
	const CREATE: typeof cds.ql.CREATE
	const DROP: typeof cds.ql.DROP

	// and these allow us to use them as type too, i.e. `const q: SELECT<Book> = ...`
	type SELECT<T> = ql.SELECT<T>
	type INSERT<T> = ql.INSERT<T>
	type UPSERT<T> = ql.UPSERT<T>
	type UPDATE<T> = ql.UPDATE<T>
	type DELETE<T> = ql.DELETE<T>
	type CREATE<T> = ql.CREATE<T>
	type DROP<T>   = ql.DROP<T>
}
