import { LinkedDefinition } from './linked'
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

}

/**
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/events)
 */
export class Event extends EventContext {

  event: string

  data: any

  headers: any

}

/**
 * @see [capire docs](https://cap.cloud.sap/docs/node.js/events)
 */
export class Request extends Event {

  params: (string | object)[]

  method: string

  path: string

  target: LinkedDefinition

  /**
   * Shortcut to {@link Request.target | target (entity) name}
   * @see https://cap.cloud.sap/docs/node.js/events#req-entity
   */
  entity: string

  query: Query

  subject: ref

  reply (results: any): void

  notify (code: number, message: string, target?: string, args?: any[]): Error

  info (code: number, message: string, target?: string, args?: any[]): Error

  warn (code: number, message: string, target?: string, args?: any[]): Error

  error (code: number, message: string, target?: string, args?: any[]): Error

  reject (code: number, message: string, target?: string, args?: any[]): Error

  notify (code: number, message: string, args?: any[]): Error

  info (code: number, message: string, args?: any[]): Error

  warn (code: number, message: string, args?: any[]): Error

  error (code: number, message: string, args?: any[]): Error

  reject (code: number, message: string, args?: any[]): Error

  notify (message: string, target?: string, args?: any[]): Error

  info (message: string, target?: string, args?: any[]): Error

  warn (message: string, target?: string, args?: any[]): Error

  error (message: string, target?: string, args?: any[]): Error

  reject (message: string, target?: string, args?: any[]): Error

  notify (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  info (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  warn (message: { code?: number | string, message: string, target?: string, args?: any[] }): Error

  error (message: { code?: number | string, message: string, target?: string, args?: any[], status?: number }): Error

  reject (message: { code?: number | string, message: string, target?: string, args?: any[], status?: number }): Error

}


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

  static Privileged: typeof Privileged

  is (role: string): boolean

}

/**
 * Subclass for executing code with superuser privileges.
 */
declare class Privileged extends User {

  constructor ()

  is (): boolean

}
