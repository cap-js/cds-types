import { EntityElements } from './csn'
//export type { Query } from './cqn'
import * as CQN from './cqn'
import { 
  Constructable,
  ArrayConstructable,
  SingularInstanceType,
  PluralInstanceType
} from './internal/inference'
import { Definition } from './linked'
import { ref } from './cqn'
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
} from './internal/query'
import { _TODO } from './internal/util'
import { Service } from './services'

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

}

export interface SELECT<T> extends Where<T>, And, Having<T>, GroupBy, OrderBy<T>, Limit, Hints {
  // overload specific to SELECT
  columns: Columns<T, this>['columns'] & ((projection: Projection<T>) => this)
}

// Q(uantity) is used to retain information about whether we are selecting one or many elements
// That way, we can do SELECT.one(...).from(Books) without the plural parameter causing a plural result,
// as SELECT.one will pass on SELECT_one as Q
export class SELECT<T, Q = SELECT_from> extends ConstructedQuery<T> {
  private constructor();

  static one: SELECT_one & { from: SELECT_one } & { localized: SELECT_one }
  
  static distinct: typeof SELECT<StaticAny>
  
  static from: SELECT_from & { localized: SELECT_from }

  static localized: SELECT_from & { from: SELECT_from }

  from: Q  // SELECT_from | SELECT_one
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


type SELECT_one =
  TaggedTemplateQueryPart<Awaitable<SELECT<_TODO, SELECT_one>, InstanceType<_TODO>>>
&
// calling with class
  (<T extends ArrayConstructable>
  (entityType: T, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>, SELECT_one>, SingularInstanceType<T> | null>)
&
  (<T extends ArrayConstructable>
  (entityType: T, primaryKey: PK, projection?: Projection<QLExtensions<SingularInstanceType<T>>>)
  => Awaitable<SELECT<SingularInstanceType<T>, SELECT_one>, SingularInstanceType<T> | null>)

  & ((entity: EntityDescription, primaryKey?: PK, projection?: Projection<unknown>) => SELECT<_TODO, SELECT_one>)
  & (<T> (entity: T[], projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null>)
  & (<T> (entity: T[], primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null>)
  & (<T> (entity: { new(): T }, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null>)
  & (<T> (entity: { new(): T }, primaryKey: PK, projection?: Projection<T>) => Awaitable<SELECT<T, SELECT_one>, T | null>)
  & ((subject: ref) => SELECT<_TODO>)

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
  & ((subject: ref) => SELECT<_TODO>)
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

  static into: (<T extends ArrayConstructable> (entity: T, ...entries: SingularInstanceType<T>[]) => INSERT<SingularInstanceType<T>>)
    & (<T extends ArrayConstructable> (entity: T, entries?: SingularInstanceType<T>[]) => INSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<INSERT<unknown>>)
    & ((entity: EntityDescription, ...entries: Entries[]) => INSERT<StaticAny>)
    & ((entity: EntityDescription, entries?: Entries) => INSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, ...entries: T[]) => INSERT<T>)
    & (<T> (entity: Constructable<T>, entries?: T[]) => INSERT<T>)

  /**
   * @deprected
   */
  as (select: SELECT<T>): this
  from (select: SELECT<T>): this
  INSERT: CQN.INSERT['INSERT']

}
type Entries<T = any> = {[key:string]: T} | {[key:string]: T} 

export interface UPSERT<T> extends Columns<T>, InUpsert<T> {}
export class UPSERT<T> extends ConstructedQuery<T> {
  private constructor();

  static into: (<T extends ArrayConstructable> (entity: T, ...entries: SingularInstanceType<T>[]) => UPSERT<SingularInstanceType<T>>)
    & (<T extends ArrayConstructable> (entity: T, entries?: SingularInstanceType<T>[]) => UPSERT<SingularInstanceType<T>>)
    & (TaggedTemplateQueryPart<UPSERT<StaticAny>>)
    & ((entity: EntityDescription, ...entries: Entries[]) => UPSERT<StaticAny>)
    & ((entity: EntityDescription, entries?: Entries) => UPSERT<StaticAny>)
    & (<T> (entity: Constructable<T>, ...entries: T[]) => UPSERT<T>)
    & (<T> (entity: Constructable<T>, entries?: T[]) => UPSERT<T>)

  UPSERT: CQN.UPSERT['UPSERT']

}

export interface DELETE<T> extends Where<T>, And, ByKey {}
export class DELETE<T> extends ConstructedQuery<T> {
  private constructor();

  static from:
    TaggedTemplateQueryPart<Awaitable<SELECT<unknown>, InstanceType<StaticAny>>>
    & (<T>(entity: EntityDescription | ArrayConstructable, primaryKey?: PK) => DELETE<T>)
    & ((subject: ref) => DELETE<_TODO>)

  DELETE: CQN.DELETE['DELETE']

}
// operator for qbe expression
type QbeOp = '=' | '-=' | '+=' | '*=' | '/=' | '%='

export interface UPDATE<T> extends Where<T>, And, ByKey {}
export class UPDATE<T> extends ConstructedQuery<T> {
  private constructor();

  static entity: (TaggedTemplateQueryPart<UPDATE<StaticAny>>)
    // UPDATE<SingularInstanceType<T>> is used here so type inference in set/with has the property keys of the singular type
    & (<T extends ArrayConstructable> (entity: T, primaryKey?: PK) => UPDATE<SingularInstanceType<T>>)
    & (<T extends Constructable> (entity: T, primaryKey?: PK) => UPDATE<InstanceType<T>>)
    & ((entity: EntityDescription | ref | Definition, primaryKey?: PK) => UPDATE<StaticAny>)
    & (<T> (entity: T, primaryKey?: PK) => UPDATE<T>)

  set: UpdateSet<this, T>
  with: UpdateSet<this, T>
  
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
  & ((data: {[P in keyof T]?: T[P] | {[op in QbeOp]?: T[P]} | CQN.xpr}) => This)

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
