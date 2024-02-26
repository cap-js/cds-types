import type { Definition, EntityElements } from './csn'
import type { Constructable, ArrayConstructable, SingularInstanceType, PluralInstanceType, Pluralise, FIXME } from './internal/inference'
import type { Columns, Where, And, Having, GroupBy, OrderBy, Limit, EntityDescription, Awaitable, TaggedTemplateQueryPart, Projection, QLExtensions, PK } from './internal/ql'
import type { ref } from './cqn'
import * as CQN from './cqn'

// export type { QLExtensions } from './cds'  // commented out because of circular dependency
export type { Query } from './cqn'


export class ConstructedQuery<T> {
  // branded type to break covariance for the subclasses
  // that don't make explicit use of the generic. So `UPDATE<Books> !<: UPDATE<number>`
  declare private _: T
  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any

}

// all the functionality of an instance of SELECT, but directly callable:
// new SELECT(...).(...) == SELECT(...)
export type StaticSELECT<T> = typeof SELECT<T>
  & ((...columns: (T extends ArrayConstructable ? keyof SingularInstanceType<T> : keyof T)[]) => SELECT<T>)
  & ((...columns: string[]) => SELECT<T>)
  & ((columns: string[]) => SELECT<T>)
  & (TaggedTemplateQueryPart<SELECT<T>>)
  & SELECT_from<T> // as it is not directly quantified, ...
  & SELECT_one<T> // ...we should expect both a scalar and a list

export declare class QL<T> {

  SELECT: StaticSELECT<T>

  INSERT: typeof INSERT
  & ((...entries: object[]) => INSERT<FIXME>)
  & ((entries: object[]) => INSERT<FIXME>)

  UPSERT: typeof UPSERT
  & ((...entries: object[]) => UPSERT<FIXME>)
  & ((entries: object[]) => UPSERT<FIXME>)

  UPDATE: typeof UPDATE
  & typeof UPDATE.entity

  DELETE: typeof DELETE
  & ((...entries: object[]) => DELETE<FIXME>)
  & ((entries: object[]) => DELETE<FIXME>)

  CREATE: typeof CREATE

  DROP: typeof DROP

}

export interface SELECT<T> extends Where, And, Having, GroupBy, OrderBy, Limit {
  // overload specific to SELECT
  columns: Columns<this>['columns'] & ((projection: Projection<T>) => this)
}
export class SELECT<T> extends ConstructedQuery<T> {

  static one: SELECT_one<FIXME> & { from: SELECT_one<FIXME> }

  static distinct: typeof SELECT<FIXME>

  static from: SELECT_from<FIXME>

  from: SELECT_from<FIXME> & TaggedTemplateQueryPart<this>
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

type SELECT_one<T> =
  TaggedTemplateQueryPart<Awaitable<SELECT<T>, InstanceType<FIXME>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)

  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<FIXME>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<FIXME>)

type SELECT_from<T> =
// tagged template
  TaggedTemplateQueryPart<Awaitable<SELECT<T>, InstanceType<FIXME>>>
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
  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<FIXME>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<FIXME>)
// put these overloads at the very end, as they would also match the above
  & (<T extends Constructable>
  (entityType: T, projection?: Projection<InstanceType<T>>)
  => Awaitable<SELECT<InstanceType<T>>, InstanceType<T>>)
  & (<T extends Constructable>
  (entityType: T, primaryKey: PK, projection?: Projection<InstanceType<T>>)
  => Awaitable<SELECT<InstanceType<T>>, InstanceType<T>>)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface INSERT<T> extends Columns {}
export class INSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => INSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: EntityDescription, entries?: object | object[]) => INSERT<FIXME>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => INSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => INSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: Definition | string) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  values (...val: FIXME[]): this

  rows (...row: FIXME[]): this

  as (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UPSERT<T> extends Columns {}
export class UPSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => UPSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<unknown>>)
    & ((entity: EntityDescription, entries?: object | object[]) => UPSERT<FIXME>)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DELETE<T> extends Where, And {}
export class DELETE<T> extends ConstructedQuery<T> {

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<FIXME>>>
    & ((entity: EntityDescription | ArrayConstructable, primaryKey?: PK) => DELETE<FIXME>)
    & ((subject: ref) => DELETE<FIXME>)

  byKey (primaryKey?: PK): this

  DELETE: CQN.DELETE['DELETE']

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UPDATE<T> extends Where, And {}
export class UPDATE<T> extends ConstructedQuery<T> {
  // cds-typer plural, singular
  static entity<T extends ArrayConstructable> (entity: T, primaryKey?: PK): UPDATE<InstanceType<T>>
  static entity<T extends Constructable> (entity: T, primaryKey?: PK): UPDATE<PluralInstanceType<T>>

  static entity (entity: EntityDescription, primaryKey?: PK): UPDATE<FIXME>

  static entity<T> (entity: T, primaryKey?: PK): UPDATE<Pluralise<T>>

  byKey (primaryKey?: PK): this
  // with (block: (e:T)=>void) : this
  // set (block: (e:T)=>void) : this

  set: TaggedTemplateQueryPart<this>
  & ((data: object) => this)

  with: TaggedTemplateQueryPart<this>
    & ((data: object) => this)

  UPDATE: CQN.UPDATE['UPDATE']

}

export class CREATE<T> extends ConstructedQuery<T> {

  static entity (entity: EntityDescription): CREATE<EntityDescription>
  CREATE: CQN.CREATE['CREATE']

}

export class DROP<T> extends ConstructedQuery<T> {

  static entity (entity: EntityDescription): DROP<EntityDescription>
  DROP: CQN.DROP['DROP']

}
