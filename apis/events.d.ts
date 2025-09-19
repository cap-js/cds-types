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
  T = any,
  P extends Record<string, any> = Record<string, any>,
  PRest extends Record<string, any>[] = Record<string, any>[]
> extends Event<T> {

  params: [P, ...PRest]

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

  notify (code: number, message: string, target?: string, args?: any[]): Error

  info (code: number, message: string, target?: string, args?: any[]): Error

  warn (code: number, message: string, target?: string, args?: any[]): Error

  error (code: number, message: string, target?: string, args?: any[]): Error

  reject (code: number, message: string, target?: string, args?: any[]): never

  notify (code: number, message: string, args?: any[]): Error

  info (code: number, message: string, args?: any[]): Error

  warn (code: number, message: string, args?: any[]): Error

  error (code: number, message: string, args?: any[]): Error

  reject (code: number, message: string, args?: any[]): never

  notify (message: string, target?: string, args?: any[]): Error

  info (message: string, target?: string, args?: any[]): Error

  warn (message: string, target?: string, args?: any[]): Error

  error (message: string, target?: string, args?: any[]): Error

  reject (message: string, target?: string, args?: any[]): never

  notify (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  info (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  warn (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  error (message: { code?: number | string, message: string, target?: string, args?: any[], status?: number }): Error

  reject (message: { code?: number | string, message: string, target?: string, args?: any[], status?: number }): never

}

export type GetRequest<
  T extends Record<string, any> = Record<string, any>,
  TRest extends Record<string, any>[] = Record<string, any>[]
> = Omit<Request, 'data' | 'params'> & {
  params: [T, ...TRest],
}

export type PostRequest<
  T = any,
  P extends Record<string, any> = Record<string, any>,
  PRest extends Record<string, any>[] = Record<string, any>[]
> = Request<T, P, PRest>;

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
