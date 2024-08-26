import { EntityElements } from './csn'
//export type { Query } from './cqn'
import * as CQN from './cqn'
import { 
  Constructable,
  ArrayConstructable,
  SingularInstanceType,
  PluralInstanceType
} from './internal/inference'
import { ref } from './cqn'
import {
  And,
  Awaitable,
  Columns,
  EntityDescription,
  Having,
  GroupBy,
  Limit,
  OrderBy,
  PK,
  Projection,
  QLExtensions,
  TaggedTemplateQueryPart,
  Where,
  ByKey
} from './internal/query'
import { _TODO } from './internal/util'

export type Query = CQN.Query

export { QLExtensions } from './internal/query'

// this just serves as a reminder that we can not get rid of some of the anys at this point
// as the would refer to the generic type of the surrounding class
type StaticAny = any

export class ConstructedQuery<T> {
  // branded type to break covariance for the subclasses
  // that don't make explicit use of the generic. So `UPDATE<Books> !<: UPDATE<number>`
  declare private _: T
  then (_resolved: (x: any) => any, _rejected: (e: Error) => any): any

}

// all the functionality of an instance of SELECT, but directly callable:
// new SELECT(...).(...) == SELECT(...)
export type StaticSELECT<T> = typeof SELECT<T>
  & SELECT<T>['columns']
  & SELECT_from<T> // as it is not directly quantified, ...
  & SELECT_one<T> // ...we should expect both a scalar and a list

export declare class QL<T> {

  SELECT: StaticSELECT<T>

  INSERT: typeof INSERT<T>
  & ((...entries: object[]) => INSERT<T>) & ((entries: object[]) => INSERT<T>)

  UPSERT: typeof UPSERT
  & ((...entries: object[]) => UPSERT<T>) & ((entries: object[]) => UPSERT<T>)

  UPDATE: typeof UPDATE<T>
  & typeof UPDATE.entity<_TODO>

  DELETE: typeof DELETE<T>
  & ((...entries: object[]) => DELETE<T>) & ((entries: object[]) => DELETE<T>)

  CREATE: typeof CREATE<T>

  DROP: typeof DROP<T>

}

export interface SELECT<T> extends Where<T>, And, Having<T>, GroupBy, OrderBy, Limit {
  // overload specific to SELECT
  columns: Columns<T, SELECT<T>>['columns'] & ((projection: Projection<T>) => this)
}
export class SELECT<T> extends ConstructedQuery<T> {

  static one: SELECT_one<StaticAny> & { from: SELECT_one<StaticAny> }

  static distinct: typeof SELECT<StaticAny>

  static from: SELECT_from<StaticAny>

  from: SELECT_from<T> 
    & TaggedTemplateQueryPart<this>
    & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => this)

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
  TaggedTemplateQueryPart<Awaitable<SELECT<T>, InstanceType<_TODO>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>)

  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<_TODO>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<_TODO>)

type SELECT_from<T> =
// tagged template
  TaggedTemplateQueryPart<Awaitable<SELECT<T>, InstanceType<_TODO>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<T>, InstanceType<T>>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<SingularInstanceType<T>>)
  => Awaitable<SELECT<SingularInstanceType<T>>, SingularInstanceType<T>>) // when specifying a key, we expect a single element as result
// calling with definition
  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<T>)
// calling with concrete list
  & (<T> (entity: T[], projection?: Projection<T>) => SELECT<T> & Promise<T[]>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T>, T>)
  & ((subject: ref) => SELECT<_TODO>)
  // put these overloads at the very end, as they would also match the above
  // We expect these to be the overloads for scalars since we covered arrays above -> wrap them back in Array
  & (<T extends Constructable>(
    entityType: T,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<PluralInstanceType<T>>, PluralInstanceType<T>>)
  & (<T extends Constructable>(
    entityType: T,
    primaryKey: PK,
    projection?: Projection<InstanceType<T>>
  ) => Awaitable<SELECT<PluralInstanceType<T>>, PluralInstanceType<T>>)

export interface INSERT<T> extends Columns<T> {}
export class INSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => INSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: EntityDescription, entries?: object | object[]) => INSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => INSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => INSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: EntityDescription) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  values (...val: any[]): this

  rows (...row: any[]): this

  as (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UPSERT<T> extends Columns<T> {}
export class UPSERT<T> extends ConstructedQuery<T> {

  static into: (<T extends ArrayConstructable> (entity: T, entries?: object | object[]) => UPSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<StaticAny>>)
    & ((entity: EntityDescription, entries?: object | object[]) => UPSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, entries?: object | object[]) => UPSERT<T>)
    & (<T> (entity: T, entries?: T | object | object[]) => UPSERT<T>)

  into: (<T extends ArrayConstructable> (entity: T) => this)
  & TaggedTemplateQueryPart<this>
  & ((entity: EntityDescription) => this)

  data (block: (e: T) => void): this

  entries (...entries: object[]): this

  values (...val: any[]): this

  rows (...row: any[]): this
  UPSERT: CQN.UPSERT['UPSERT']

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DELETE<T> extends Where, And, ByKey {}
export class DELETE<T> extends ConstructedQuery<T> {

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<StaticAny>>>
    & (<T>(entity: EntityDescription | ArrayConstructable, primaryKey?: PK) => DELETE<T>)
    & ((subject: ref) => DELETE<_TODO>)

  DELETE: CQN.DELETE['DELETE']

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UPDATE<T> extends Where<T>, And, ByKey {}


export class UPDATE<T> extends ConstructedQuery<T> {

  // cds-typer plural
  // FIXME: this returned UPDATE<SingularInstanceType<T>> before. should UPDATE<Books>.entity(...) return Book or Books?
  static entity<T extends ArrayConstructable> (entity: T, primaryKey?: PK): UPDATE<InstanceType<T>>

  static entity (entity: EntityDescription, primaryKey?: PK): UPDATE<StaticAny>

  static entity<T> (entity: Constructable<T>, primaryKey?: PK): UPDATE<T>

  static entity<T> (entity: T, primaryKey?: PK): UPDATE<T>

  // with (block: (e:T)=>void) : this
  // set (block: (e:T)=>void) : this
  set: TaggedTemplateQueryPart<this>
  & ((data: object) => this);

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
