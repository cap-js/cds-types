import { EntityElements } from './csn'
import * as CQN from './cqn'
import { Constructable, ArrayConstructable, SingularType, PluralType } from './internal/inference'
import { ref, column_expr } from './cqn'

export type Query = CQN.Query

export class ConstructedQuery {

  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any

}


// all the functionality of an instance of SELECT, but directly callable:
// new SELECT(...).(...) == SELECT(...)
export type StaticSELECT<T> = typeof SELECT
  & ((...columns: (T extends ArrayConstructable<any> ? keyof SingularType<T> : keyof T)[]) => SELECT<T>)
  & ((...columns: string[]) => SELECT<T>)
  & ((columns: string[]) => SELECT<T>)
  & (TaggedTemplateQueryPart<SELECT<T>>)
  & SELECT_from // as it is not directly quantified, ...
  & SELECT_one // ...we should expect both a scalar and a list

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

export class SELECT<T> extends ConstructedQuery {

  static one: SELECT_one & { from: SELECT_one }

  static distinct: typeof SELECT

  static from: SELECT_from

  from: SELECT_from & TaggedTemplateQueryPart<this>
  & ((entity: Target, primaryKey?: PK, projection?: Projection<unknown>) => this)

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

  & ((entity: Target, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
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
  & ((entity: Target, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<any>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<any>)
  // put these overloads at the very end, as they would also match the above
  // We expect these to be the overloads for scalars since we covered arrays above -> wrap them back in Array
  & (<T extends Constructable<any>>(
    entityType: T,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<PluralType<T>>, PluralType<T>>)
  & (<T extends Constructable<any>>(
    entityType: T,
    primaryKey: PK,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<PluralType<T>>, PluralType<T>>)


export class INSERT<T> extends ConstructedQuery {

  static into: (<T extends ArrayConstructable<any>> (entity: T, entries?: object | object[]) => INSERT<SingularType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: Target, entries?: object | object[]) => INSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => INSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => INSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Target) => this)

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
    & ((entity: Target, entries?: object | object[]) => UPSERT<any>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => UPSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => UPSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Target) => this)

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
    & ((entity: Target | ArrayConstructable, primaryKey?: PK) => DELETE<any>)
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

  static entity (entity: Target, primaryKey?: PK): UPDATE<any>

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

  static entity (entity: Target): CREATE<any>

  CREATE: CQN.CREATE['CREATE']

}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export class DROP<T> extends ConstructedQuery {

  static entity (entity: Target): DROP<any>

  DROP: CQN.DROP['DROP']

}
