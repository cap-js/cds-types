import { Readable, Writable } from 'node:stream'
import { EntityElements } from './csn'
//export type { Query } from './cqn'
import * as CQN from './cqn'
import {
  Constructable,
  ArrayConstructable,
  SingularInstanceType,
  PluralInstanceType,
  Unwrap
} from './internal/inference'
import { Definition } from './linked'
import { ref as cqn_ref, column_expr, predicate } from './cqn'

/** Forcefully derives an entity class type from an instance to retain constructor-level metadata in subject overloads. */
type ClassInstance = { constructor: any }
type NonConstructable<T> = T extends Constructable ? never : T
type EntityClassFromInstance<T extends ClassInstance> =
  T extends { constructor: infer C }
    ? C & Constructable<T> & { kind: 'entity' }
    : Constructable<T> & { kind: 'entity' }

import {
  And,
  Awaitable,
  Columns,
  EntityDescription,
  Having,
  Hints,
  GroupBy,
  Limit,
  OrderBy,
  PK,
  Projection,
  QLExtensions,
  TaggedTemplateQueryPart,
  Where,
  ByKey,
  InUpsert,
  DeepPartial,
} from './internal/query'
import { _TODO } from './internal/util'
import { Service } from './services'

export type Query = CQN.Query

export { QLExtensions, PredicateMap } from './internal/query'

// this just serves as a reminder that we can not get rid of some of the anys at this point
// as the would refer to the generic type of the surrounding class
type StaticAny = any

export class ConstructedQuery<T> {
  // branded type to break covariance for the subclasses
  // that don't make explicit use of the generic. So `UPDATE<Books> !<: UPDATE<number>`
  declare private _: T
  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any
  bind (service: Service): this
}

// all the functionality of an instance of SELECT, but directly callable:
// new SELECT(...).(...) == SELECT(...)
export type StaticSELECT<T> = { columns: SELECT<T>['columns'] }
  & typeof SELECT<T>
  & SELECT<T>['columns']
  & SELECT_from // as it is not directly quantified, ...
  & SELECT_one // ...we should expect both a scalar and a list

export declare class QL<T> {

  SELECT: StaticSELECT<T>

  INSERT: typeof INSERT<T>
  & ((...entries: object[]) => INSERT<T>) & ((entries: object[]) => INSERT<T>)

  UPSERT: typeof UPSERT
  & ((...entries: object[]) => UPSERT<T>) & ((entries: object[]) => UPSERT<T>)

  UPDATE: typeof UPDATE<T>
  & typeof UPDATE.entity

  DELETE: typeof DELETE<T>
  & ((...entries: object[]) => DELETE<T>) & ((entries: object[]) => DELETE<T>)

  CREATE: typeof CREATE<T>

  DROP: typeof DROP<T>

  /**
   * CXL helper: creates a `{ ref: [...] }` CQN object from a tagged template or string.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  ref: CXLRef

  /**
   * CXL helper: creates a `{ val: ... }` CQN object.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  val: CXLVal

  /**
   * CXL helper: creates a `{ xpr: [...] }` expression from a tagged template.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  expr: CXLExpr

  /**
   * CXL helper: builds an `expand` column expression from a ref, with optional clauses.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  expand: CXLExpand

  /**
   * CXL helper: builds a `where` predicate from a tagged template.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  where: CXLWhere

  /**
   * CXL helper: builds an `orderBy` clause from a tagged template.
   * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
   */
  orderBy: CXLOrderBy

}

// CXL helper function types for programmatic CQN construction

/** CXL helper that creates a `{ ref: string[] }` object from a tagged template string */
export type CXLRef = TaggedTemplateQueryPart<CQN.ref> & ((path: string) => CQN.ref)
/** CXL helper that wraps a value into a `{ val: any }` object */
export type CXLVal = (<V>(value: V) => { val: V })
/** CXL helper that creates a `{ xpr: [...] }` CQN expression from a tagged template */
export type CXLExpr = TaggedTemplateQueryPart<CQN.xpr>
/** CXL helper that produces an array of column expressions from a tagged template */
export type CXLColumns = TaggedTemplateQueryPart<column_expr[]> & ((...cols: column_expr[]) => column_expr[])
/** CXL helper that produces an expanded column expression (subselect on association/composition) */
export type CXLExpand = (ref: CQN.ref, ...clauses: (predicate | { sort?: 'asc' | 'desc', nulls?: 'first' | 'last' }[] | column_expr[])[]) => column_expr & { expand: column_expr[] }
/** CXL helper that creates a predicate from a tagged template */
export type CXLWhere = TaggedTemplateQueryPart<predicate>
/** CXL helper that creates an orderBy clause from a tagged template */
export type CXLOrderBy = TaggedTemplateQueryPart<{ sort?: 'asc' | 'desc', nulls?: 'first' | 'last' }[]>

/**
 * Named CXL helper functions destructurable from `cds.ql`.
 * @example
 * const { ref, val, columns, expand, where, orderBy } = cds.ql
 * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
 */
export declare const ref: CXLRef
export declare const val: CXLVal
export declare const expr: CXLExpr
export declare const columns: CXLColumns
export declare const expand: CXLExpand
export declare const where: CXLWhere
export declare const orderBy: CXLOrderBy

/**
 * `cds.ql` acts as a universal converter for CDS queries — callable as a tagged template,
 * a function accepting a CQN object, or a plain string. Also carries all query builder
 * classes and CXL helper functions as properties.
 *
 * @example
 * let q = cds.ql `SELECT from Books where ID=${201}`
 * let q = cds.ql ({ SELECT: { from: { ref: ['Books'] }, ... } })
 * const { ref, val, where, orderBy } = cds.ql
 * @see [capire](https://cap.cloud.sap/docs/releases/2024/dec24#cdsql-enhancements)
 */
export declare function ql (query: CQN.Query | string): SELECT<unknown>
export declare function ql (strings: TemplateStringsArray, ...params: unknown[]): SELECT<unknown>

export interface SELECT<T> extends Where<T>, And, Having<T>, GroupBy, OrderBy<T>, Limit, Hints {
  // overload specific to SELECT
  columns: Columns<T, this>['columns'] & ((projection: Projection<T>) => this)
}

// Q(uantity) is used to retain information about whether we are selecting one or many elements
// That way, we can do SELECT.one(...).from(Books) without the plural parameter causing a plural result,
// as SELECT.one will pass on SELECT_one as Q
export class SELECT<T, Q = SELECT_from> extends ConstructedQuery<T> {
  private constructor();
  [Symbol.asyncIterator](): AsyncIterableIterator<Unwrap<T>>

  static one: SELECT_one & { from: SELECT_one } & { localized: SELECT_one }

  static distinct: typeof SELECT<StaticAny>

  static from: SELECT_from & { localized: SELECT_from }

  static localized: SELECT_from & { from: SELECT_from }

  from: Q  // SELECT_from | SELECT_one
    & TaggedTemplateQueryPart<this>
    & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => this)

  forShareLock (): this

  forUpdate({ wait, ignoreLocked }?: { wait?: number, ignoreLocked?: boolean }): this

  alias (as: string): this
  elements: EntityElements

  SELECT: CQN.SELECT['SELECT'] & {
    forUpdate?: { wait: number },
    forShareLock?: { wait: number },
    search?: CQN.predicate,
    count?: boolean,
  }

  /**
   * Pipes the raw data stream into the given writable stream.
   * @param stream the writable stream to pipe the raw data into
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-ql#pipeline)
   * @since 9.3.0
   */
  pipeline(stream: Writable): Promise<void>
  /**
   * @deprecated use `.stream()` instead
   */
  pipeline(): Promise<Readable>

  /**
   * Returns the raw data stream.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-ql#stream)
   * @since 9.4.0
   * @returns Readable
   */
  stream(): Promise<Readable>

  /**
   * Calls the given callback function for each row in the result set.
   * @param cb the callback function to call for each row
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/cds-ql#foreach)
   * @since 9.3.0
   */
  foreach: (cb: (element: Unwrap<T>) => void) => Promise<void>
}

type SELECT_one =
  TaggedTemplateQueryPart<Awaitable<SELECT<_TODO, SELECT_one>, InstanceType<_TODO>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>, SELECT_one>, SingularInstanceType<T> | null | undefined>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>, SELECT_one>, SingularInstanceType<T> | null | undefined>)

  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<_TODO, SELECT_one>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null | undefined>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null | undefined>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null | undefined>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null | undefined>)
  & ((subject: cqn_ref) => SELECT<_TODO>)
  & (<T extends ClassInstance> (subject: NonConstructable<T>) => Awaitable<SELECT<InstanceType<EntityClassFromInstance<T>>, SELECT_one>, InstanceType<EntityClassFromInstance<T>> | null | undefined>)

type SELECT_from =
// tagged template
  TaggedTemplateQueryPart<Awaitable<SELECT<_TODO>, InstanceType<_TODO>>>
&
// calling with class
  (<E extends ArrayConstructable>
  (entityType: E, projection?: Projection<QLExtensions<SingularInstanceType<E>>>)
  => Awaitable<SELECT<E>, InstanceType<E>>)
&
  (<E extends ArrayConstructable>
  (entityType: E, primaryKey: PK, projection?: Projection<SingularInstanceType<E>>)
  => Awaitable<SELECT<SingularInstanceType<E>>, SingularInstanceType<E> | null>) // when specifying a key, we expect a single element as result
// calling with definition
  & (<T>(entity: EntityDescription, primaryKey?: PK, projection?: Projection<T>) => SELECT<T>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: cqn_ref) => SELECT<_TODO>)
  & (<T extends ClassInstance> (subject: NonConstructable<T>) => Awaitable<SELECT<InstanceType<EntityClassFromInstance<T>>>, InstanceType<EntityClassFromInstance<T>>[]>)
  // put these overloads at the very end, as they would also match the above
  // We expect these to be the overloads for scalars since we covered arrays above -> wrap them back in Array
  & (<T extends Constructable>(
    entityType: T,
    columns: string[]  // could be keyof in the future
  ) => Awaitable<SELECT<PluralInstanceType<T>>, PluralInstanceType<T>>)
  & (<T extends Constructable>(
    entityType: T,
    primaryKey: PK,
    columns: string[]  // could be keyof in the future
  ) => Awaitable<SELECT<InstanceType<T>>, InstanceType<T>>)
  & (<T extends Constructable>(
    entityType: T,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<PluralInstanceType<T>>, PluralInstanceType<T>>)
  & (<T extends Constructable>(
    entityType: T,
    primaryKey: PK,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<InstanceType<T>>, InstanceType<T>>)
  // currently no auto completion of columns, due to complexity

export interface INSERT<T> extends Columns<T>, InUpsert<T> {}
export class INSERT<T> extends ConstructedQuery<T> {
  private constructor();

  static into: (<T extends ArrayConstructable> (entity: T, ...entries: DeepPartial<SingularInstanceType<T>>[]) => INSERT<SingularInstanceType<T>>)
    & (<T extends ArrayConstructable> (entity: T, entries?: DeepPartial<SingularInstanceType<T>>[]) => INSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: EntityDescription, ...entries: Entries[]) => INSERT<StaticAny>)
    & ((entity: EntityDescription, entries?: Entries) => INSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, ...entries: DeepPartial<T>[]) => INSERT<T>)
    & (<T> (entity: Constructable<T>, entries?: DeepPartial<T>[]) => INSERT<T>)

  from (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}
type Entries<T = any> = {[key:string]: T} | {[key:string]: T}

export interface UPSERT<T> extends Columns<T>, InUpsert<T> {}
export class UPSERT<T> extends ConstructedQuery<T> {
  private constructor();

  static into: (<T extends ArrayConstructable> (entity: T, ...entries: DeepPartial<SingularInstanceType<T>>[]) => UPSERT<SingularInstanceType<T>>)
    & (<T extends ArrayConstructable> (entity: T, entries?: DeepPartial<SingularInstanceType<T>>[]) => UPSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<StaticAny>>)
    & ((entity: EntityDescription, ...entries: Entries[]) => UPSERT<StaticAny>)
    & ((entity: EntityDescription, entries?: Entries) => UPSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, ...entries: DeepPartial<T>[]) => UPSERT<T>)
    & (<T> (entity: Constructable<T>, entries?: DeepPartial<T>[]) => UPSERT<T>)

  UPSERT: CQN.UPSERT['UPSERT']

}

export interface DELETE<T> extends Where<T>, And, ByKey {}
export class DELETE<T> extends ConstructedQuery<T> {
  private constructor();

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<StaticAny>>>
    & (<T>(entity: EntityDescription | ArrayConstructable, primaryKey?: PK) => DELETE<T>)
    & ((subject: cqn_ref) => DELETE<_TODO>)
    & (<T extends ClassInstance>(subject: NonConstructable<T>) => DELETE<InstanceType<EntityClassFromInstance<T>>>)

  DELETE: CQN.DELETE['DELETE']

}
// operator for qbe expression
type QbeOp = '=' | '-=' | '+=' | '*=' | '/=' | '%='

export interface UPDATE<T> extends Where<T>, And, ByKey {
  set: UpdateSet<this, T>
  with: UpdateSet<this, T>
}

export class UPDATE<T> extends ConstructedQuery<T> {
  private constructor();

  static entity: (TaggedTemplateQueryPart<UPDATE<StaticAny>>)
    // UPDATE<SingularInstanceType<T>> is used here so type inference in set/with has the property keys of the singular type
    & (<T extends ArrayConstructable> (entity: T, primaryKey?: PK) => UPDATE<SingularInstanceType<T>>)
    & (<T extends Constructable> (entity: T, primaryKey?: PK) => UPDATE<InstanceType<T>>)
    & ((entity: EntityDescription | cqn_ref | Definition, primaryKey?: PK) => UPDATE<StaticAny>)
    & (<T extends ClassInstance> (subject: NonConstructable<T>) => UPDATE<InstanceType<EntityClassFromInstance<T>>>)
    & (<T> (entity: T, primaryKey?: PK) => UPDATE<T>)

  UPDATE: CQN.UPDATE['UPDATE']
}

/**
 * Represents updatable block that can be passed to either `.set` or `.with`
 * of an `UPDATE` query
 */
type UpdateSet<This, T> = TaggedTemplateQueryPart<This>
  // simple value   > title: 'Some Title'
  // qbe expression > stock: { '-=': quantity }
  // cqn expression > descr: {xpr: [{ref:[descr]}, '||', 'Some addition to descr.']}
  & ((data: {[P in keyof T]?: T[P] | DeepPartial<T[P]> | {[op in QbeOp]?: DeepPartial<T[P]>} | CQN.xpr}) => This)

export class CREATE<T> extends ConstructedQuery<T> {
  private constructor();

  static entity (entity: EntityDescription): CREATE<EntityDescription>

  CREATE: CQN.CREATE['CREATE']

}

export class DROP<T> extends ConstructedQuery<T> {
  private constructor();

  static entity (entity: EntityDescription): DROP<EntityDescription>

  DROP: CQN.DROP['DROP']

}
