import { SELECT, INSERT, UPDATE, DELETE, Query, ConstructedQuery, UPSERT } from './ql'
import { Awaitable } from './ql'
import { ArrayConstructable, Constructable } from './internal/inference'
import { LinkedCSN, LinkedDefinition, Definitions } from './linked'
import { CSN } from './csn'
import { EventContext } from './events'
import { Request } from './events'

export class QueryAPI {

  entities : LinkedCSN['entities']

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  read: {
    <T extends ArrayConstructable<any>>(entity: T, key?: any): Awaitable<SELECT<T>, InstanceType<T>>
    <T>(entity: LinkedDefinition | string, key?: any): SELECT<T>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  create: {
    <T extends ArrayConstructable<any>>(entity: T, key?: any): INSERT<T>
    <T>(entity: LinkedDefinition | string, key?: any): INSERT<T>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  insert: {
    <T extends ArrayConstructable<any>>(data: T): INSERT<T>
    <T>(data: object | object[]): INSERT<T>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  upsert: {
    <T extends ArrayConstructable<any>>(data: T): UPSERT<T>
    <T>(data: object | object[]): UPSERT<T>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  update: {
    <T extends ArrayConstructable<any>>(entity: T, key?: any): UPDATE<T>
    <T>(entity: LinkedDefinition | string, key?: any): UPDATE<T>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  run: {
    (query: ConstructedQuery | ConstructedQuery[]): Promise<ResultSet | any>
    (query: Query): Promise<ResultSet | any>
    (query: string, args?: any[] | object): Promise<ResultSet | any>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#crud-style-api)
   */
  delete<T>(entity: LinkedDefinition | string, key?: any): DELETE<T>

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#srv-foreach-entity)
   */
  foreach(query: Query, callback: (row: object) => void): this

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/core-services#srv-stream-column)
   */
  stream: {
    (column: string): {
      from(entity: LinkedDefinition | string): {
        where(filter: any): ReadableStream
      }
    }
    (query: Query): Promise<ReadableStream>
  }

  /**
   * Starts or joins a transaction
   * @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx)
   */

  tx: {
    (fn: (tx: Transaction) => {}): Promise<unknown>
    (context?: object): Transaction
    (context: object, fn: (tx: Transaction) => {}): Promise<unknown>
  }

  transaction: {
    (fn: (tx: Transaction) => {}): Promise<unknown>
    (context?: object): Transaction
    (context: object, fn: (tx: Transaction) => {}): Promise<unknown>
  }

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx#cds-spawn)
   */
  spawn(options: {
    [key: string]: any
    every?: number
    after?: number
  }, fn: (tx: Transaction) => {}): SpawnEventEmitter

  /**
   * @see [docs](https://cap.cloud.sap/docs/node.js/cds-tx#event-contexts
   */
  context?: EventContext
}


/**
 * Class cds.Service
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
 */
export class Service extends QueryAPI {
  constructor(
    name: string,
    model: CSN,
    options: {
      kind: string
      impl: string | ServiceImpl
    }
  )

  /**
   * The name of the service
   */
  name: string

  /**
   * The model from which the service's definition was loaded
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  model: LinkedCSN

  /**
   * Provides access to the entities exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  entities: Definitions & ((namespace: string) => Definitions)

  /**
   * Provides access to the events declared by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  events: Definitions & ((namespace: string) => Definitions)

  /**
   * Provides access to the types exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  types: Definitions & ((namespace: string) => Definitions)

  /**
   * Provides access to the operations, i.e. actions and functions, exposed by a service
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services)
   */
  operations: Definitions & ((namespace: string) => Definitions)

  /**
   * Acts like a parameter-less constructor. Ensure to call `await super.init()` to have the base class’s handlers added.
   * You may register own handlers before the base class’s ones, to intercept requests before the default handlers snap in.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#srv-init)
   */
  init(): Promise<void>

  /**
   * Constructs and emits an asynchronous event.
   * @see [capire docs](https://cap.cloud.sap/docs/core-services#srv-emit-event)
   */
  emit: {
    <T = any>(details: { event: types.event; data?: object; headers?: object }): Promise<T>
    <T = any>(event: types.event, data?: object, headers?: object): Promise<T>
  }

  /**
   * Constructs and sends a synchronous request.
   * @see [capire docs](https://cap.cloud.sap/docs/node.js/core-services#srv-send-request)
   */
  send: {
    <T = any>(event: types.event, path: string, data?: object, headers?: object): Promise<T>
    <T = any>(event: types.event, data?: object, headers?: object): Promise<T>
    <T = any>(details: { event: types.event; data?: object; headers?: object }): Promise<T>
    <T = any>(details: { query: ConstructedQuery; data?: object; headers?: object }): Promise<T>
    <T = any>(details: { method: types.eventName; path: string; data?: object; headers?: object }): Promise<T>
    <T = any>(details: { event: types.eventName; entity: LinkedDefinition | string; data?: object; params?: object }): Promise<T>
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
    <T = any>(entityOrPath: types.target, data?: object): DELETE<T>
    <T extends ArrayConstructable<any>>(entity: T, key?: any): DELETE<T>
    <T>(entity: LinkedDefinition | string, key?: any): DELETE<T>
  }

  // The central method to dispatch events
  dispatch(msg: types.event): Promise<any>

  // Provider API
  prepend(fn: ServiceImpl): Promise<this>
  on<T extends Constructable>(eve: types.event, entity: T, handler: CRUDEventHandler.On<InstanceType<T>, InstanceType<T> | void | Error>): this
  on<F extends CdsFunction>(boundAction: F, service: string, handler: ActionEventHandler<F['__parameters'], void | Error | F['__returns']>): this
  on<F extends CdsFunction>(unboundAction: F, handler: ActionEventHandler<F['__parameters'], void | Error | F['__returns']>): this
  on(eve: types.event, entity: types.target, handler: OnEventHandler): this
  on(eve: types.event, handler: OnEventHandler): this


  // onSucceeded (eve: types.Events, entity: types.Target, handler: types.EventHandler): this
  // onSucceeded (eve: types.Events, handler: types.EventHandler): this
  // onFailed (eve: types.Events, entity: types.Target, handler: types.EventHandler): this
  // onFailed (eve: types.Events, handler: types.EventHandler): this
  before<T extends Constructable>(eve: types.event, entity: T, handler: CRUDEventHandler.Before<InstanceType<T>, InstanceType<T> | void | Error>): this
  before(eve: types.event, entity: types.target, handler: EventHandler): this
  before(eve: types.event, handler: EventHandler): this
  after<T extends Constructable>(eve: types.event, entity: T, handler: CRUDEventHandler.After<InstanceType<T>, InstanceType<T> | void | Error>): this
  after(eve: types.event, entity: types.target, handler: ResultsHandler): this
  after(eve: types.event, handler: ResultsHandler): this
  reject(eves: types.event, ...entity: types.target[]): this
}

export class ApplicationService extends Service {}
export class MessagingService extends Service {}
export class RemoteService extends Service {}
export class DatabaseService extends Service {
  deploy(model?: CSN | string): Promise<CSN>
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
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


interface Transaction extends Service {
  commit(): Promise<void>
  rollback(): Promise<void>
}

interface ResultSet extends Array<{}> {}

interface ServiceImpl {
  (this: Service, srv: Service): any
}

interface EventHandler {
  // (msg : types.EventMessage) : Promise<any> | any | void
  (req: Request): Promise<any> | any | void
}

interface OnEventHandler {
  (req: Request, next: Function): Promise<any> | any | void
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
type OneOrMany<T> = T | T[];

// functions generated by cds-typer explicitly carry types for
// parameters and return type, as their names are not accessible from
// function signatures to the type system.
// This meta information is required in .on action handlers.
type CdsFunction = {
  (...args: any[]): any,
  __parameters: object,
  __returns: unknown
}

type TypedRequest<T> = Omit<Request, 'data'> & { data: T }

// https://cap.cloud.sap/docs/node.js/core-services#srv-on-before-after
declare namespace CRUDEventHandler {
  type Before<P,R> = (req: TypedRequest<P>) => Promise<R> | R
  type On<P,R> = (req: TypedRequest<P>, next: (...args: any) => Promise<R> | R) => Promise<R> | R
  type After<P,R> = (data: undefined | P, req: TypedRequest<P>) => Promise<R> | R
}

// Handlers for actions try to infer the passed .data property
// as strictly as possible and therefore have to remove
// { data: any } (inherited EventMessage} with a more restricted
// type, based on the parameters of the action.
interface ActionEventHandler<P,R> {
  (req: Omit<Request, 'data'> & { data: P }, next: Function): Promise<R> | R
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
  'succeeded': (res: any) => void
  'failed': (error: any) => void
  'done': () => void
}

declare class SpawnEventEmitter {
  on<U extends keyof SpawnEvents>(
    event: U, listener: SpawnEvents[U]
  ): this;

  emit<U extends keyof SpawnEvents>(
    event: U, ...args: Parameters<SpawnEvents[U]>
  ): boolean;
  timer: any
}

declare namespace types {
  type event = eventName | eventName[]
  type eventName = (string & {})
    | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
    | 'NEW' | 'EDIT' | 'PATCH' | 'SAVE'
    | 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'
    | 'COMMIT' | 'ROLLBACK'
  type target = string | LinkedDefinition | ArrayConstructable<any>
}
