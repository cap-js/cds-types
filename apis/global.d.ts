import * as ql from './ql'  // referenced in rollup-patch.js, so be careful when changing it

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
