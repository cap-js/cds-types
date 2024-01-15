import { Definition, EntityElements } from './csn'
import * as CQN from './cqn'
import { Constructable, ArrayConstructable, SingularType } from './internal/inference'
import { LinkedEntity } from './linked'
import { ref, column_expr } from './cqn'

export type Query = CQN.Query

export class ConstructedQuery {

  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any

}


export type PK = number | string | object


type Primitive = string | number | boolean | Date

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
  as: (alias: string) => void,

  /**
	 * Accesses any nested attribute based on a [path](https://cap.cloud.sap/cap/docs/java/query-api#path-expressions):
	 * `X.get('a.b.c.d')`. Note that you will not receive
	 * proper typing after this call.
	 * To still have access to typed results, use
	 * `X.a().b().c().d()` instead.
	 */
  get: (path: string) => any,

  // have to exclude undefined from the type, or we'd end up with a distribution of Subqueryable
  // over T and undefined, which gives us zero code completion within the callable.
} & Subqueryable<Exclude<T, undefined>>

/**
 * Adds the ability for subqueries to structured properties.
 * The final result of each subquery will be the property itself:
 * `Book.title` == `Subqueryable<Book>.title()`
 */
type Subqueryable<T> = T extends Primitive	? unknown
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
export type Projection<T> = (e: QLExtensions<T extends ArrayConstructable ? SingularType<T> : T>) => void
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
  & ((...columns: (T extends ArrayConstructable<any> ? keyof SingularType<T> : keyof T)[]) => SELECT<T>)
  & ((...columns: string[]) => SELECT<T>)
  & ((columns: string[]) => SELECT<T>)
  & (TaggedTemplateQueryPart<SELECT<T>>)
  & SELECT_one // as it is not directly quantified, ...
  & SELECT_from // ...we should expect both a scalar and a list

declare class QL<T> {

  SELECT: StaticSELECT<T>

  INSERT: typeof INSERT
  & ((...entries: object[]) => INSERT<any>) & ((entries: object[]) => INSERT<any>)

  UPSERT: typeof UPSERT
  & ((...entries: object[]) => UPSERT<any>) & ((entries: object[]) => UPSERT<any>)

  UPDATE: typeof UPDATE
  & typeof UPDATE.entity

  DELETE: typeof DELETE
  & ((...entries: object[]) => DELETE<any>) & ((entries: object[]) => DELETE<any>)

  CREATE: typeof CREATE

  DROP: typeof DROP

}

// used as a catch-all type for using tagged template strings: SELECT `foo`. from `bar` etc.
// the resulting signatures are actually not very strongly typed, but they at least accept template strings
// when run in strict mode.
// This signature has to be added to a method as intersection type.
// Defining overloads with it will override preceding signatures and the other way around.
type TaggedTemplateQueryPart<T> = (strings: TemplateStringsArray, ...params: unknown[]) => T

export class SELECT<T> extends ConstructedQuery {

  static one: SELECT_one & { from: SELECT_one }

  static distinct: typeof SELECT

  static from: SELECT_from

  from: SELECT_from & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => this)

  byKey (primaryKey?: PK): this
  columns: TaggedTemplateQueryPart<this>
  & ((projection: Projection<T>) => this)
  & ((...col: (T extends ArrayConstructable<any> ? keyof SingularType<T> : keyof T)[]) => this)
  & ((...col: (string | column_expr)[]) => this)
  & ((col: (string | column_expr)[]) => this)

  where: TaggedTemplateQueryPart<this>
  & ((predicate: object) => this)
  & ((...expr: any[]) => this)

  and: TaggedTemplateQueryPart<this>
  & ((predicate: object) => this)
  & ((...expr: any[]) => this)

  having: TaggedTemplateQueryPart<this>
  & ((...expr: string[]) => this)
  & ((predicate: object) => this)

  groupBy: TaggedTemplateQueryPart<this>
  & ((...expr: string[]) => this)

  orderBy: TaggedTemplateQueryPart<this>
  & ((...expr: string[]) => this)

  limit: TaggedTemplateQueryPart<this>
  & ((rows: number, offset?: number) => this)

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
  (<T extends ArrayConstructable<any>>
  (entityType: T, projection?: Projection<QLExtensions<SingularType<T>>>)
  => Awaitable<SELECT<SingularType<T>>, SingularType<T>>)
&
  (<T extends ArrayConstructable<any>>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularType<T>>>)
  => Awaitable<SELECT<SingularType<T>>, SingularType<T>>)

  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & ((entity: LinkedEntity | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<any>)

type SELECT_from =
// tagged template
  TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<any>>>
&
// calling with class
  (<T extends ArrayConstructable<any>>
  (entityType: T, projection?: Projection<QLExtensions<SingularType<T>>>)
  => Awaitable<SELECT<T>, InstanceType<T>>)
&
  (<T extends ArrayConstructable<any>>
  (entityType: T, primaryKey: PK, projection?: Projection<SingularType<T>>)
  => Awaitable<SELECT<SingularType<T>>, InstanceType<SingularType<T>>>) // when specifying a key, we expect a single element as result
// calling with definition
  & ((entity: Definition | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
  & ((entity: LinkedEntity | string, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<any>)

export class INSERT<T> extends ConstructedQuery {

  static into: (<T extends ArrayConstructable<any>> (entity: T, entries?: object | object[]) => INSERT<SingularType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: Definition | string, entries?: object | object[]) => INSERT<any>)
    & ((entity: LinkedEntity | string, entries?: object | object[]) => INSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => INSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => INSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  columns (...col: (T extends ArrayConstructable<any> ? keyof SingularType<T> : keyof T)[]): this

  columns (...col: string[]): this

  values (...val: any[]): this

  rows (...row: any[]): this

  as (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}


export class UPSERT<T> extends ConstructedQuery {

  static into: (<T extends ArrayConstructable<any>> (entity: T, entries?: object | object[]) => UPSERT<SingularType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<unknown>>)
    & ((entity: Definition | string, entries?: object | object[]) => UPSERT<any>)
    & ((entity: LinkedEntity | string, entries?: object | object[]) => UPSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => UPSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => UPSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  columns (...col: (T extends ArrayConstructable<any> ? keyof SingularType<T> : keyof T)[]): this

  columns (...col: string[]): this

  values (...val: any[]): this

  rows (...row: any[]): this
  UPSERT: CQN.UPSERT['UPSERT']

}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class DELETE<T> extends ConstructedQuery {

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<any>>>
    & ((entity: Definition | string | ArrayConstructable, primaryKey?: PK) => DELETE<any>)
    & ((entity: LinkedEntity | string | ArrayConstructable, primaryKey?: PK) => DELETE<any>)
    & ((subject: ref) => DELETE<any>)

  byKey (primaryKey?: PK): this

  where (predicate: object): this

  where (...expr: any[]): this

  and (predicate: object): this

  and (...expr: any[]): this
  DELETE: CQN.DELETE['DELETE']

}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class UPDATE<T> extends ConstructedQuery {

  // cds-typer plural
  static entity<T extends ArrayConstructable<any>> (entity: T, primaryKey?: PK): UPDATE<SingularType<T>>

  static entity (entity: Definition | string, primaryKey?: PK): UPDATE<any>

  static entity (entity: LinkedEntity | string, primaryKey?: PK): UPDATE<any>

  static entity<T> (entity: Constructable<T>, primaryKey?: PK): UPDATE<T>

  static entity<T> (entity: T, primaryKey?: PK): UPDATE<T>

  byKey (primaryKey?: PK): this
  // with (block: (e:T)=>void) : this
  // set (block: (e:T)=>void) : this
  set: TaggedTemplateQueryPart<this>
  & ((data: object) => this);

  with: TaggedTemplateQueryPart<this>
    & ((data: object) => this)

  where (predicate: object): this

  where (...expr: any[]): this

  and (predicate: object): this

  and (...expr: any[]): this
  UPDATE: CQN.UPDATE['UPDATE']

}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class CREATE<T> extends ConstructedQuery {

  static entity (entity: Definition | string): CREATE<any>

  static entity (entity: LinkedEntity | string): CREATE<any>
  CREATE: CQN.CREATE['CREATE']

}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class DROP<T> extends ConstructedQuery {

  static entity (entity: Definition | string): DROP<any>

  static entity (entity: LinkedEntity | string): DROP<any>
  DROP: CQN.DROP['DROP']

}
