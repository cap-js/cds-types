import { SELECT, INSERT, UPDATE, DELETE, Query, ConstructedQuery, UPSERT } from './ql'
import { Awaitable } from './internal/query'
import { ArrayConstructable, Constructable, SingularInstanceType, Unwrap } from './internal/inference'
//import { ModelPart, CSN, LinkedDefinition, LinkedEntity } from './linked'
import * as linked from './linked'
import * as csn from './csn'
import { EventContext } from './events'
import { Request } from './events'
import { ReadableStream } from 'node:stream/web'
import { _TODO } from './internal/util'
import { ref } from './cqn'

type Key = number | string | any

export class QueryAPI {

  entities: linked.LinkedCSN['entities']

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  read: {
    <T extends ArrayConstructable>(entity: T, key?: Key): Awaitable<SELECT<T>, InstanceType<T>>,
    <T>(entity: linked.Definition | string, key?: Key): SELECT<T>,
    (entity: ref, key?: Key): SELECT<unknown>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  create: {
    <T extends ArrayConstructable>(entity: T, key?: Key): INSERT<T>,
    <T>(entity: linked.Definition | string, key?: Key): INSERT<T>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  insert: {
    <T extends ArrayConstructable>(data: T): INSERT<T>,
    <T>(data: object | object[]): INSERT<T>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  upsert: {
    <T extends ArrayConstructable>(data: T): UPSERT<T>,
    <T>(data: object | object[]): UPSERT<T>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  update: {
    <T extends ArrayConstructable>(entity: T, key?: Key): UPDATE<T>,
    <T>(entity: linked.Definition | string, key?: Key): UPDATE<T>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  run: {
    (query: ConstructedQuery<_TODO> | ConstructedQuery<_TODO>[]): Promise<ResultSet | any>,
    (query: Query): Promise<ResultSet | any>,
    (query: string, args?: any[] | object): Promise<ResultSet | any>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#srv-stream-column)
   */
  stream: {
    (column: string): {
      from(entity: linked.Definition | string): {
        where(filter: any): ReadableStream,
      },
    },
    (query: Query): Promise<ReadableStream>,
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  delete<T>(entity: linked.Definition | string, key?: Key): DELETE<T>

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#srv-foreach-entity)
   */
  foreach (query: Query, callback: (row: object) => void): this

  /**
   * @deprecated use {@link QueryAPI.tx} instead
   */
  transaction: QueryAPI['tx']

  tx: {
    (fn: (tx: Transaction) => object): Promise<unknown>,
    (context?: object): Transaction,
    (context: object, fn: (tx: Transaction) => object): Promise<unknown>,
  }

}

type PropertiesOf<T> = {
  [K in keyof T]?: T[K];
};

/**
 * Class cds.Service
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
 */
export class Service extends QueryAPI {

  constructor (
    name?: string,
    model?: csn.CSN,
    options?: {
      kind: string,
      impl: string | ServiceImpl,
    }
  )

  /**
   * The kind of the service
   */
  kind: string

  /**
   * The name of the service
   */
  name: string

  /**
   * The model from which the service's definition was loaded
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  model: linked.LinkedCSN

  /**
   * Provides access to the entities exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  entities: linked.ModelPart<linked.classes.entity>

  /**
   * Provides access to the events declared by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  events: linked.ModelPart<linked.classes.event>

  /**
   * Provides access to the types exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  types: linked.ModelPart<linked.classes.type>

  /**
   * Provides access to the operations, i.e. actions and functions, exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  operations: linked.ModelPart<linked.classes.action>

  /**
   * Acts like a parameter-less constructor. Ensure to call `await super.init()` to have the base class’s handlers added.
   * You may register own handlers before the base class’s ones, to intercept requests before the default handlers snap in.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#srv-init)
   */
  init (): Promise<void>

  /**
   * Constructs and emits an asynchronous event.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#srv-emit-event)
   */
  emit: {
    // we can only give very little guidance as to code completion here.
    // Users will receive suggestions/ code completion for the property names of P.
    // But they will see no complaints for when they pass a non-existing property or use the wrong type for it.
    // That is because classes still fulfill {name:string}, so they can be used for the overload where event of type types.event,
    // which allows for any object as data.
    <P extends Constructable, R>(event: P, data: PropertiesOf<InstanceType<P>>, headers?: object): Promise<R>,
    <P extends ArrayConstructable, R>(event: P, data: PropertiesOf<SingularInstanceType<P>>, headers?: object): Promise<R>,
    <T = any>(event: types.event, data?: object, headers?: object): Promise<T>,
    <T = any>(details: { event: types.event, data?: object, headers?: object }): Promise<T>,
    <T = any>(event: types.event, data?: object, headers?: object): Promise<T>,
  }

  /**
   * Constructs and sends a synchronous request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#srv-send-request)
   */
  send: {
    <T = any>(event: types.event, path: string, data?: object, headers?: object): Promise<T>,
    <T = any>(event: types.event, data?: object, headers?: object): Promise<T>,
    <T = any>(details: { event: types.event, data?: object, headers?: object }): Promise<T>,
    <T = any>(details: { query: ConstructedQuery<T>, data?: object, headers?: object }): Promise<T>,
    <T = any>(details: { method: types.eventName, path: string, data?: object, headers?: object }): Promise<T>,
    <T = any>(details: { event: types.eventName, entity: linked.Definition | string, data?: object, params?: object, headers?: object }): Promise<T>,
  }

  /**
   * Constructs and sends a GET request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#rest-style-api)
   */
  get<T = any>(entityOrPath: types.target, data?: object): Promise<T>

  /**
   * Constructs and sends a POST request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#rest-style-api)
   */
  post<T = any>(entityOrPath: types.target, data?: object): Promise<T>

  /**
   * Constructs and sends a PUT request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#rest-style-api)
   */
  put<T = any>(entityOrPath: types.target, data?: object): Promise<T>

  /**
   * Constructs and sends a PATCH request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#rest-style-api)
   */
  patch<T = any>(entityOrPath: types.target, data?: object): Promise<T>

  /**
   * Constructs and sends a DELETE request.
   */
  delete: {
    <T = any>(entityOrPath: types.target, data?: object): DELETE<T>,
    <T extends ArrayConstructable>(entity: T, key?: Key): DELETE<T>,
    <T>(entity: linked.Definition | string, key?: Key): DELETE<T>,
  }

  // The central method to dispatch events
  dispatch (msg: types.event): Promise<any>

  // FIXME: not yet documented, will come in future version
  // disconnect (tenant?: string): Promise<void>

  // Provider API
  prepend (fn: ServiceImpl): this

  on<T extends ArrayConstructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.On<Unwrap<T>>): this
  on<T extends Constructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.On<InstanceType<T>>): this
  on<F extends CdsFunction>(boundAction: F, service: string, handler: ActionEventHandler<F['__self'], F['__parameters'], void | Error | F['__returns']>): this
  on<F extends CdsFunction>(unboundAction: F, handler: ActionEventHandler<F['__self'], F['__parameters'], void | Error | F['__returns']>): this
  on (eve: types.event, entity: types.target, handler: OnEventHandler): this
  on (eve: types.event, handler: OnEventHandler): this
  on (eve: 'error', handler: OnErrorHandler): this

  // onSucceeded (eve: types.Events, entity: types.Target, handler: types.EventHandler): this
  // onSucceeded (eve: types.Events, handler: types.EventHandler): this
  // onFailed (eve: types.Events, entity: types.Target, handler: types.EventHandler): this
  // onFailed (eve: types.Events, handler: types.EventHandler): this
  before<F extends CdsFunction>(boundAction: F, service: string, handler: CRUDEventHandler.Before<F['__parameters'], void | Error | F['__returns']>): this
  before<F extends CdsFunction>(unboundAction: F, handler: CRUDEventHandler.Before<F['__parameters'], void | Error | F['__returns']>): this
  before<T extends ArrayConstructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.Before<Unwrap<T>>): this
  before<T extends Constructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.Before<InstanceType<T>>): this
  before (eve: types.event, entity: types.target, handler: EventHandler): this
  before (eve: types.event, handler: EventHandler): this

  // order relevant:
  // (2) check if T is arrayable -> unwrap array type
  // (3) check if T is scalar -> use T directly
  // this streamlines that in _most_ cases, handlers will receive a single object.
  // _Except_ for after.read handlers (1), which will change its inflection based on T.
  after<T extends ArrayConstructable>(event: 'READ', entity: T | T[], handler: CRUDEventHandler.After<InstanceType<T>>): this
  after<T extends ArrayConstructable>(event: 'each', entity: T | T[], handler: CRUDEventHandler.After<Unwrap<T>>): this
  after<T extends Constructable>(event: 'READ' | 'each', entity: T | T[], handler: CRUDEventHandler.After<InstanceType<T>>): this
  after<T extends ArrayConstructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.After<Unwrap<T>>): this
  after<T extends Constructable>(eve: types.event, entity: T | T[], handler: CRUDEventHandler.After<InstanceType<T>>): this
  after<F extends CdsFunction>(boundAction: F, service: string, handler: CRUDEventHandler.After<F['__parameters'], void | Error | F['__returns']>): this
  after<F extends CdsFunction>(unboundAction: F, handler: CRUDEventHandler.After<F['__parameters'], void | Error | F['__returns']>): this
  after (eve: types.event, entity: types.target, handler: ResultsHandler): this
  after (eve: types.event, handler: ResultsHandler): this

  reject (eves: types.event, ...entity: types.target[]): this

}

export class ApplicationService extends Service {
  new<T extends Constructable>(draft: T, data: {[K in keyof InstanceType<T>]?: InstanceType<T>[K]}): Promise<unknown>
  new<T extends Constructable>(draft: T): {
    for(keys: Key[]): Promise<unknown>,
  }
  discard(draft: Constructable, keys: Key[]): Promise<unknown>
  edit(draft: Constructable, keys: Key[]): Promise<unknown>
  save(draft: Constructable, keys: Key[]): Promise<unknown>
}
export class MessagingService extends Service {}
export class RemoteService extends Service {}
export class DatabaseService extends Service {
  deploy (model?: csn.CSN | string): Promise<csn.CSN>
  begin (): Promise<void>
  commit (): Promise<void>
  rollback (): Promise<void>
}


export default class cds {

  /**
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  Service: typeof Service

  /**
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/app-services)
   */
  ApplicationService: typeof ApplicationService

  /**
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/remote-services)
   */
  RemoteService: typeof RemoteService

  /**
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/messaging)
   */
  MessagingService: typeof MessagingService

  /**
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/databases)
   */
  DatabaseService: typeof DatabaseService

}


export interface Transaction extends Service {
  commit(): Promise<void>
  rollback(): Promise<void>
}

interface ResultSet extends Array<object> {}

interface ServiceImpl {
  (this: Service, srv: Service): any
}

interface EventHandler {
  // (msg : types.EventMessage) : Promise<any> | any | void
  (req: Request): Promise<any> | any | void
}

interface OnEventHandler {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (req: Request, next: Function): Promise<any> | any | void
}

interface OnErrorHandler {
  (err: Error, req: Request): any | void
}

// `Partial` wraps any type and allows all properties to be undefined
// in addition to their actual type.
// This is important in the context of CRUD events, where
// entities could be lacking any properties, like a non-existing ID
// or when DB fields are corrupted, etc.
type Partial<T> = { [Key in keyof T]: undefined | T[Key] }

// Naming the first parameter in a handler `each` has special voodoo
// semantic which makes it impossible for us to infer the exact behaviour on a type level.
// So we always have to expect scalars as well as arrays in some callbacks.
type OneOrMany<T> = T | T[]

// functions generated by cds-typer explicitly carry types for
// parameters and return type, as their names are not accessible from
// function signatures to the type system.
// This meta information is required in .on action handlers.
/**
 * @beta helper
 */
type CdsFunction = {
  (...args: any[]): any,
  __parameters: object,
  __returns: any,
  __self?: any,  // the entity the function is bound to, in case of bound functions
}

// extracts all CdsFunction properties from T
/**
 * @beta helper
 */
type CdsFunctions<T> = Pick<T, { [K in keyof T]: T[K] extends CdsFunction ? K : never }[keyof T]>

/**
 * Types herein can be used to type handler functions that are not declared in line:
 * @example
 * ```ts
 * import { myAction } from '#cds-models/myService'
 * 
 * function onMyFunction (req: HandlerFunction<typeof myAction>['parameters']['req']): HandlerFunction<typeof myAction>['returns'] {
 *   ...
 * }
 * 
 * srv.on(myAction, onMyFunction)
 * ```
 */
export type HandlerFunction<F extends CdsFunction> = {
  parameters: {
    /** @beta helper */
    req: Request<F['__parameters']>,
  },
  /** @beta helper */
  returns: F['__returns'],
}

// https://cap.cloud.sap/docs/node.js/core-services#srv-on-before-after
declare namespace CRUDEventHandler {
  type Before<P, R = P | void | Error> = (req: Request<P>) => Promise<R> | R
  type On<P, R = P | void | Error> = (req: Request<P>, next: (...args: any[]) => Promise<R> | R) => Promise<R> | R
  type After<P, R = P | void | Error> = (data: undefined | P, req: Request<P>) => Promise<R> | R
}

// Handlers for actions try to infer the passed .data property
// as strictly as possible and therefore have to remove
// { data: any } (inherited EventMessage} with a more restricted
// type, based on the parameters of the action.
interface ActionEventHandler<S, P, R> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (req: Omit<Request, 'data'> & { data: P, subject: S }, next: Function): Promise<R> | R
}

// Note: the behaviour of ResultsHandler changes based on the name of the parameter.
// If the parameter in the hook is called "each", it is called once for each row in the result,
// otherwise it gets called exactly one time with the entire result.
// This runtime behaviour can not be described on type level
// (in a way that would benefit the user).
// The user will therefore receive "any" as their result/ each. If we could some day differentiate,
// we may want to add a generic to ResultsHandler which is passed from the EventHandlers down below.
interface ResultsHandler {
  (results: any[], req: Request): void
  (each: any, req: Request): void
}

interface SpawnEvents {
  succeeded: (res: any) => void
  failed: (error: any) => void
  done: () => void
}

declare class SpawnEventEmitter {

  on<U extends keyof SpawnEvents>(
    event: U, listener: SpawnEvents[U]
  ): this

  emit<U extends keyof SpawnEvents>(
    event: U, ...args: Parameters<SpawnEvents[U]>
  ): boolean
  timer: any

}

declare namespace types {
  type event = eventName | eventName[]
  type eventName = { name: string } | string
    | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
    | 'NEW' | 'EDIT' | 'PATCH' | 'SAVE'
    | 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'
    | 'COMMIT' | 'ROLLBACK'
  type target = string | linked.Definition | linked.classes.entity | (string | linked.Definition | linked.classes.entity)[] | ArrayConstructable
}

type SpawnOptions = {
  [key: string]: any,
  every?: number,
  after?: number,
}

// FIXME: this was ?: EventContext before. Is context supposed to not be present sometimes?
// let, as apparently we can reassign?
/**
 * @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx#event-contexts
 */
export let context: EventContext | undefined

/**
* @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx#cds-spawn)
*/
export function spawn (options: SpawnOptions, fn: (tx: Transaction) => object): SpawnEventEmitter


// facade proxies into cds.db, which is a Service
/**
* Starts or joins a transaction
* @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx)
*/
export const tx: {
  (fn: (tx: Transaction) => object): Promise<any>,
  (context?: object): Transaction,
  (context: object, fn: (tx: Transaction) => object): Promise<any>,
}
export const entities: Service['entities']
export const run: Service['run']
export const foreach: Service['foreach']
export const stream: Service['stream']
export const read: Service['read']
export const create: Service['create']
export const insert: Service['insert']
export const update: Service['update']
// temporarily moved to cds.d.ts, as "delete" is a reserved keyword
// export const delete: Service['delete']
// FIXME: see Service.disconnect comment
// export const disconnect: Service['disconnect']
export const transaction: Service['transaction']
export const db: DatabaseService
// export const upsert: Service['upsert']

export const outboxed: (service: Service) => Service
export const unboxed: (service: Service) => Service
