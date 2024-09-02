import type { Definition } from '../csn'
import type { entity } from '../linked/classes'
import type { column_expr } from '../cqn'
import type { ArrayConstructable, Constructable, SingularInstanceType, Unwrap, UnwrappedInstanceType } from './inference'
import { ConstructedQuery } from '../ql'
import { KVPairs } from './util'

// https://cap.cloud.sap/docs/node.js/cds-ql?q=projection#projection-functions
type Projection<T> = (e: QLExtensions<T extends ArrayConstructable ? SingularInstanceType<T> : T>) => void
type Primitive = string | number | boolean | Date
type EntityDescription = entity | Definition | string // FIXME: Definition not allowed here?, FIXME: { name: string } | ?
type PK = number | string | object
// used as a catch-all type for using tagged template strings: SELECT `foo`. from `bar` etc.
// the resulting signatures are actually not very strongly typed, but they at least accept template strings
// when run in strict mode.
// This signature has to be added to a method as intersection type.
// Defining overloads with it will override preceding signatures and the other way around.
type TaggedTemplateQueryPart<T> = (strings: TemplateStringsArray, ...params: unknown[]) => T

type QueryArtefact = {

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

}

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

// note to self: don't try to rewrite these intersection types into overloads.
// It does not work because TaggedTemplateQueryPart will not fit in as regular overload
export interface ByKey {
  byKey (primaryKey?: PK): this
}

// unwrap the target of a query and extract its keys.
// Normalise to scalar,
// or fall back to general strings/column expressions
type KeyOfTarget<T, F = string | column_expr> = T extends ConstructedQuery<infer U>
  ? (U extends ArrayConstructable  // Books
    ? keyof SingularInstanceType<U>
    : U extends Constructable  // Book
      ? keyof InstanceType<U>
      : F)
  : F

  type KeyOfSingular<T> = Unwrap<T> extends T
    ? keyof T
    : keyof Unwrap<T>

// as static SELECT borrows the type of Columns directly,
// we need this second type argument to explicitly specific that "this" 
// refers to a STATIC<T>, not to a Columns. Or else we could not chain
// other QL functions to .columns
export interface Columns<T, This = undefined> {
  columns:
  ((...col: KeyOfSingular<T>[]) => This extends undefined ? this : This)
  & ((...col: (string | column_expr)[]) => This extends undefined ? this : This)
  & ((col: (string | column_expr)[]) => This extends undefined ? this : This)
  & TaggedTemplateQueryPart<This extends undefined ? this : This>
}

type Op = '=' | '<' | '>' | '<=' | '>=' | '!=' | 'in' | 'like'
type WS = '' | ' '
type Expression<E extends string | number | bigint | boolean> = `${E}${WS}${Op}${WS}`
type ColumnValue = Primitive | Readonly<Primitive[]> | SELECT<any>  // not entirely sure why Readonly is required here
// TODO: it would be nicer to check for E[x] for the value instead of Primitive, where x is the key
type Expressions<L,E> = KVPairs<L, Expression<Exclude<keyof E, symbol>>, ColumnValue> extends true 
  ? L 
  // fallback: allow for any string. Important for when user renamed properties
  : KVPairs<L, Expression<string>, ColumnValue> extends true
    ? L
    : never

type HavingWhere<This, E> = 
  /**
   * @param predicate - An object with keys that are valid fields of the target entity and values that are compared to the respective fields.
   * @example
   * ```js
   * SELECT.from(Books).where({ ID: 42 })  // where ID is a valid field of Book
   * SELECT.from(Books).having({ ID: 42 })  // where ID is a valid field of Book
   * ```
   */
  ((predicate: Partial<{[column in KeyOfTarget<This extends ConstructedQuery<infer E> ? E : never, never>]: any}>) => This)
  /**
   * @param expr - An array of expressions, where every odd element is a valid field of the target entity and every even element is a value that is compared to the respective field.
   * @example
   * ```js
   * SELECT.from(Books).where(['ID =', 42 ])  // where ID is a valid, numerical field of Book
   * SELECT.from(Books).having(['ID =', 42 ])  // where ID is a valid, numerical field of Book
   *```
   */
  & (<const L extends unknown[]>(...expr: Expressions<L, UnwrappedInstanceType<E>>) => This)
  & ((...expr: string[]) => This)
  & TaggedTemplateQueryPart<This>

export interface Having<T> {
  having: HavingWhere<this, T>
}

export interface Where<T> {
  where: HavingWhere<this, T>
}

export interface GroupBy {
  groupBy: TaggedTemplateQueryPart<this>
  & ((...expr: string[]) => this)
}

export interface OrderBy {
  orderBy: TaggedTemplateQueryPart<this>
  & ((...expr: string[]) => this)
}

export interface Limit {
  limit: TaggedTemplateQueryPart<this>
  & ((rows: number, offset?: number) => this)
}

export interface And {
  and: TaggedTemplateQueryPart<this>
  & ((predicate: object) => this)
  & ((...expr: any[]) => this)
}

export interface InUpsert<T> {
  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  values (...val: any[]): this

  rows (...row: any[]): this

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: EntityDescription) => this)
}

// don't wrap QLExtensions in more QLExtensions (indirection to work around recursive definition)
export type QLExtensions<T> = T extends QLExtensions_<any> ? T : QLExtensions_<T>

/**
 * QLExtensions are properties that are attached to entities in CQL contexts.
 * They are passed down to all properties recursively.
*/
// have to exclude undefined from the type, or we'd end up with a distribution of Subqueryable
// over T and undefined, which gives us zero code completion within the callable.
type QLExtensions_<T> = { [Key in keyof T]: QLExtensions<T[Key]> } & QueryArtefact & Subqueryable<Exclude<T, undefined>>

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