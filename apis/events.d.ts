import { Definition, LinkedCSN } from './linked'
import { Query } from './cqn'
import { ref } from './cqn'
import * as express from 'express'


/**
 * Represents the invocation context of incoming request and event messages.
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/events)
 */
export class EventContext {

  constructor (properties: { event: string, data?: object, query?: object, headers?: object })
  http?: { req: express.Request, res: express.Response }

  tenant: string

  user: User

  id: string

  locale: `${string}_${string}`

  timestamp: Date

  features?: { [key: string]: boolean }

  model: LinkedCSN

}

/**
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/events)
 */
export class Event<T = unknown> extends EventContext {

  event: string

  data: T

  headers: any

  before(phase: 'commit', handler: () => void)

  on(phase: 'succeeded' | 'failed' | 'done', handler: () => void)

}

/**
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/events)
 */
export class Request<
  D = any,
  P extends Record<string, any>[] = Record<string, any>[]
> extends Event<D> {

  params: P

  method: string

  path: string

  target: Definition

  /**
   * Shortcut to {@link Request.target | target (entity) name}
   * @see https://cap.cloud.sap/docs/node.js/events#req-entity
   */
  entity: string

  query: Query

  subject: ref

  reply (results: any): void
  /** @beta */
  reply (results: any, options: { mimetype?: string, filename?: string, [key: string]: any }): void

  // positional args
  notify (message: string, target?: string, args?: any[]): Error
  notify (status: number, message?: string, target?: string, args?: any[]): Error

  info (message: string, target?: string, args?: any[]): Error
  info (status: number, message?: string, target?: string, args?: any[]): Error

  warn (message: string, target?: string, args?: any[]): Error
  warn (status: number, message?: string, target?: string, args?: any[]): Error

  error (message: string, target?: string, args?: any[]): Error
  error (status: number, message?: string, target?: string, args?: any[]): Error
  error (status: number, target?: string, args?: any[]): Error

  reject (message: string, target?: string, args?: any[]): never
  reject (status: number, message?: string, target?: string, args?: any[]): never

  // single object arg
  notify (message: { status?: number, code?: number | string, message: string, target?: string, args?: any[] }): Error
  notify (message: { status?: number, code: number | string, message?: string, target?: string, args?: any[] }): Error

  info (message: { status?: number, code?: number | string, message: string, target?: string, args?: any[] }): Error
  info (message: { status?: number, code: number | string, message?: string, target?: string, args?: any[] }): Error

  warn (message: { status?: number, code?: number | string, message: string, target?: string, args?: any[] }): Error
  warn (message: { status?: number, code: number | string, message?: string, target?: string, args?: any[] }): Error

  error (message: { status?: number, code?: number | string, message: string, target?: string, args?: any[] }): Error
  error (message: { status?: number, code: number | string, message?: string, target?: string, args?: any[] }): Error

  reject (message: { status?: number, code?: number | string, message: string, target?: string, args?: any[] }): never
  reject (message: { status?: number, code: number | string, message?: string, target?: string, args?: any[] }): never

}

export type GetRequest<
  P extends Record<string, any>[]
> = Request<Record<never, never>, P>;

export type PostRequest<
  D = any,
  P extends Record<string, any>[] = Record<string, any>[]
> = Request<D, P>;

/**
 * Represents the user in a given context.
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/authentication#cds-user)
 */
export class User {

  constructor (obj?: string | { id: string, attr: Record<string, string>, roles: Array<string> | Record<string, string> } | User)
  id: string

  /**
   * @deprecated Use https://cap.cloud.sap/docs/node.js/events#locale instead
   */
  locale: string

  /**
   * @deprecated Use https://cap.cloud.sap/docs/node.js/events#tenant instead
   */
  tenant: string | undefined

  attr: Record<string, string>

  roles: Array<string> | Record<string, string>

  static Anonymous: typeof Anonymous

  static anonymous: Anonymous

  static Privileged: typeof Privileged

  static privileged: Privileged

  static default: User

  is (role: string): boolean

}

/**
 * Subclass representing unauthenticated users.
 */
declare class Anonymous extends User {

  constructor ()

  is (): boolean

}

/**
 * Subclass for executing code with superuser privileges.
 */
declare class Privileged extends User {

  constructor ()

  is (): boolean

}
