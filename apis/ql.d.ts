import { Definition, EntityElements } from './csn'
import * as CQN from './cqn'
import { Constructable, ArrayConstructable, SingularInstanceType, PluralInstanceType, Pluralise } from './internal/inference'
import { LinkedEntity } from './linked'
import { ref, column_expr } from './cqn'

type Primitive = string | number | boolean | Date
export type Query = CQN.Query
export type PK = number | string | object

export class ConstructedQuery<T> {
  // branded type to break covariance for the subclasses
  // that don't make explicit use of the generic. So `UPDATE<Books> !<: UPDATE<number>`
  declare private _: T
  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any

}

// don't wrap QLExtensions in more QLExtensions (indirection to work around recursive definition)
type QLExtensions<T> = T extends QLExtensions_<any> ? T : QLExtensions_<T>

/**
 * QLExtensions are properties that are attached to entities in CQL contexts.
 * They are passed down to all properties recursively.
*/
type QLExtensions_<T> = {
  [Key in keyof T]: QLExtensions<T[Key]>
} & {

  /**
	 * Alias for this attribute.
	 */
  as (alias: string): void,

  /**
	 * Accesses any nested attribute based on a [path](https://cap.cloud.sap/cap/docs/java/query-api#path-expressions):
	 * `X.get('a.b.c.d')`. Note that you will not receive
	 * proper typing after this call.
	 * To still have access to typed results, use
	 * `X.a().b().c().d()` instead.
	 */
  get (path: string): any,

  // have to exclude undefined from the type, or we'd end up with a distribution of Subqueryable
  // over T and undefined, which gives us zero code completion within the callable.
} & Subqueryable<Exclude<T, undefined>>

/**
 * Adds the ability for subqueries to structured properties.
 * The final result of each subquery will be the property itself:
 * `Book.title` == `Subqueryable<Book>.title()`
 */
type Subqueryable<T> = T extends Primitive ? unknown
// composition of many/ association to many
  : T extends readonly unknown[] ? {

    /**
	 * @example
	 * ```js
	 * SELECT.from(Books, b => b.author)
	 * ```
	 * means: "select all books and project each book's author"
	 *
	 * whereas
	 * ```js
	 * SELECT.from(Books, b => b.author(a => a.ID))
	 * ```
	 * means: "select all books, subselect each book's author's ID
	 *
	 * Note that you do not need to return anything from these subqueries.
	 */
    (fn: ((a: QLExtensions<T[number]>) => any) | '*'): T[number],
  }
    // composition of one/ association to one
    : {

      /**
	 * @example
	 * ```js
	 * SELECT.from(Books, b => b.author)
	 * ```
	 * means: "select all books and project each book's author"
	 *
	 * whereas
	 * ```js
	 * SELECT.from(Books, b => b.author(a => a.ID))
	 * ```
	 * means: "select all books, subselect each book's author's ID
	 *
	 * Note that you do not need to return anything from these subqueries.
	 */
      (fn: ((a: QLExtensions<T>) => any) | '*'): T,
    }


// Alias for projections
// https://cap.cloud.sap/docs/node.js/cds-ql?q=projection#projection-functions
// export type Projection<T> = (e:T)=>void
export type Projection<T> = (e: QLExtensions<T extends ArrayConstructable ? SingularInstanceType<T> : T>) => void
// Type for query pieces that can either be chained to build more complex queries or
// awaited to materialise the result:
// `Awaitable<SELECT<Book>, Book> = SELECT<Book> & Promise<Book>`
//
// While the benefit is probably not immediately obvious as we don't exactly
// save a lot of typing over explicitly writing `SELECT<Book> & Promise<Book>`,
// it makes the semantics more explicit. Also sets us up for when TypeScript ever
// improves their generics to support:
//
// `Awaitable<T> = T extends unknown<infer I> ? (T & Promise<I>) : never`
// (at the time of writing, infering the first generic parameter of ANY type
// does not seem to be possible.)
export type Awaitable<T, I> = T & Promise<I>

// all the functionality of an instance of SELECT, but directly callable:
// new SELECT(...).(...) == SELECT(...)
export type StaticSELECT<T> = typeof SELECT
  & ((...columns: (T extends ArrayConstructable ? keyof SingularInstanceType<T> : keyof T)[]) => SELECT<T>)
  & ((...columns: string[]) => SELECT<T>)
  & ((columns: string[]) => SELECT<T>)
  & (TaggedTemplateQueryPart<SELECT<T>>)
  & SELECT_one // as it is not directly quantified, ...
  & SELECT_from // ...we should expect both a scalar and a list

declare class QL<T> {

  SELECT: StaticSELECT<T>

  INSERT: typeof INSERT
  & ((...entries: object[]) => INSERT<any>)
  & ((entries: object[]) => INSERT<any>)

  UPSERT: typeof UPSERT
  & ((...entries: object[]) => UPSERT<any>)
  & ((entries: object[]) => UPSERT<any>)

  UPDATE: typeof UPDATE
  & typeof UPDATE.entity

  DELETE: typeof DELETE
  & ((...entries: object[]) => DELETE<any>)
  & ((entries: object[]) => DELETE<any>)

  CREATE: typeof CREATE

  DROP: typeof DROP

}

// used as a catch-all type for using tagged template strings: SELECT `foo`. from `bar` etc.
// the resulting signatures are actually not very strongly typed, but they at least accept template strings
// when run in strict mode.
// This signature has to be added to a method as intersection type.
// Defining overloads with it will override preceding signatures and the other way around.
type TaggedTemplateQueryPart<T> = (strings: TemplateStringsArray, ...params: unknown[]) => T

interface SELECT extends Columns, Where, And, Having, GroupBy, OrderBy, Limit {}
export class SELECT<T> extends ConstructedQuery<T> {

  static one: SELECT_one<T> & { from: SELECT_one<T> }

  static distinct: typeof SELECT<T>

  static from: SELECT_from<T>

  // overload for columns(...) specific for SELECT
  columns (projection: Projection<T>): this

  from: SELECT_from & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => this)

  byKey (primaryKey?: PK): this

  forShareLock (): this

  forUpdate ({ wait }?: { wait?: number }): this

  alias (as: string): this
  elements: EntityElements


  // Not yet public
  // fullJoin (other: string, as: string) : this
  // leftJoin (other: string, as: string) : this
  // 	rightJoin (other: string, as: string) : this
  // 	innerJoin (other: string, as: string) : this
  // 	join (other: string, as: string, kind?: string) : this
  // on : TaggedTemplateQueryPart<this>
  //   & ((...expr : string[]) => this)
  //   & ((predicate:object) => this)

  SELECT: CQN.SELECT['SELECT'] & {
    forUpdate?: { wait: number },
    forShareLock?: { wait: number },
    search?: CQN.predicate,
    count?: boolean,
  }

}

type SELECT_one =
  TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<any>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)

  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & ((entity: LinkedEntity | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<any>)

type SELECT_from<T> =
// tagged template
  TaggedTemplateQueryPart<Awaitable<SELECT<T>, InstanceType<any>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<T>, InstanceType<T>>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<SingularInstanceType<T>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, InstanceType<SingularInstanceType<T>>>) // when specifying a key, we expect a single element as result
// calling with definition
  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & ((entity: LinkedEntity | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<any>)

interface INSERT extends Columns {}
export class INSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => INSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: LinkedEntity | Definition | string, entries?: object | object[]) => INSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => INSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => INSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  values (...val: any[]): this

  rows (...row: any[]): this

  as (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}


interface UPSERT extends Columns {}
export class UPSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => UPSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<unknown>>)
    & ((entity: LinkedEntity | Definition | string, entries?: object | object[]) => UPSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => UPSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => UPSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this


  values (...val: any[]): this

  rows (...row: any[]): this
  UPSERT: CQN.UPSERT['UPSERT']

}

interface DELETE extends Where, And {}
export class DELETE<T> extends ConstructedQuery<T> {

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<any>>>
    & ((entity: LinkedEntity | Definition | string | ArrayConstructable, primaryKey?: PK) => DELETE<any>)
    & ((subject: ref) => DELETE<any>)

  byKey (primaryKey?: PK): this

  DELETE: CQN.DELETE['DELETE']

}

export interface UPDATE extends Whereable, Andable {}
export class UPDATE<T> extends ConstructedQuery<T> {
  // cds-typer plural, singular
  static entity<T extends ArrayConstructable> (entity: T, primaryKey?: PK): UPDATE<InstanceType<T>>
  static entity<T extends Constructable> (entity: T, primaryKey?: PK): UPDATE<PluralInstanceType<T>>

  static entity (entity: LinkedEntity | Definition | string, primaryKey?: PK): UPDATE<any>

  static entity<T> (entity: T, primaryKey?: PK): UPDATE<Pluralise<T>>

  byKey (primaryKey?: PK): this
  // with (block: (e:T)=>void) : this
  // set (block: (e:T)=>void) : this
  set (data: object): this
  set: TaggedTemplateQueryPart<this>

  with (data: object): this
  with: TaggedTemplateQueryPart<this>

  UPDATE: CQN.UPDATE['UPDATE']

}

interface Where {
  where: ((predicate: object) => this)
  where: ((...expr: any[]) => this)
  where: TaggedTemplateQueryPart<this>
}

interface And {
  and: ((predicate: object) => this)
  and: ((...expr: any[]) => this)
  and: TaggedTemplateQueryPart<this>
}

interface Columns {
  columns (...col: (T extends ArrayConstructable ? keyof SingularInstanceType<T> : keyof T)[]): this
  columns (...col: (string | column_expr)[]): this
  columns (col: (string | column_expr)[]): this
  columns: TaggedTemplateQueryPart<this>
}

interface Having {
  having (...expr: string[]): this
  having (predicate: object): this
  having: TaggedTemplateQueryPart<this>
}

interface GroupBy {
  groupBy (...expr: string[]): this
  groupBy: TaggedTemplateQueryPart<this>
}

interface OrderBy {
  orderBy (...expr: string[]): this
  orderBy: TaggedTemplateQueryPart<this>
}

interface Limit {
  limit (rows: number, offset?: number): this
  limit: TaggedTemplateQueryPart<this>
}


export class CREATE<T> extends ConstructedQuery<T> {

  static entity (entity: Definition | string): CREATE<T>

  static entity (entity: LinkedEntity | string): CREATE<T>
  CREATE: CQN.CREATE['CREATE']

}

export class DROP<T> extends ConstructedQuery<T> {

  static entity (entity: Definition | string): DROP<T>

  static entity (entity: LinkedEntity | string): DROP<T>
  DROP: CQN.DROP['DROP']

}
