import { Service, ServiceImpl } from './services'
import { CSN } from './csn'
import * as http from 'http'
import type * as cds from './cds'
import { Application, RequestHandler } from 'express'
import { XOR } from './internal/util'

type _cds = typeof cds
type service_dict = { [name: string]: Service };
// interface instead of type so users can insert their actual Services via module augmentation
interface cds_services extends service_dict {}

export const connect: {

  /**
		 * Connects to a specific datasource.
		 * @example cds.connect.to ('service')
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
		 */
  to(datasource: string, options?: cds_connect_options): Promise<Service>,

  /**
	 * Shortcut for 'db' as the primary database returning `cds.DatabaseService`
	 * @example cds.connect.to ('db')
	*/
  to(datasource: 'db', options?: cds_connect_options): Promise<cds.DatabaseService>,

  /**
	 * Connects to a specific datasource via a Service subclass
	 * @example cds.connect.to (ServiceClass)
	 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
	 */
  to<S extends Service>(datasource: {new(): S}, options?: cds_connect_options): Promise<S>,

  /**
		 * Connects to a specific datasource via options.
		 * @example cds.connect.to ({ kind:..., impl:... })
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
		 */
  to(options: cds_connect_options): Promise<Service>,

  /**
		 * Connects the primary datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect)
		 */
  // API extractor cannot handle the direct usages of the cds namespace in typeof cds, so add an indirection.
  (options?: string | cds_connect_options): Promise<_cds>, // > cds.connect(<options>)
}

/**
	 * The default bootstrap function as loaded from server.js
	 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const server: Function

/**
	 * Constructs service providers from respective service definitions
	 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-serve)
	 */
export const serve: (service: string, options?: {
  service?: string,
  from?: '*' | 'all' | string,
  [key: string]: any,
}) => Promise<cds_services> & cds_serve_fluent


/**
	 * Emitted whenever a model is loaded using cds.load().
	 */
// FIXME: this is actually supposed to be part of models.d.ts
// but had to be moved here so export * would not clash their definitions
export function on (event: 'loaded', listener: (model: CSN) => void): _cds

/**
	 * Emitted whenever a specific service is connected for the first time.
	 */
export function on (event: 'connect', listener: (srv: Service) => void): _cds


/**
	 * Emitted at the very beginning of the bootsrapping process, when the
	 * express application has been constructed but no middlewares or routes
	 * added yet.
	 */
export function on (event: 'bootstrap', listener: (app: Application) => void): _cds
export function once (event: 'bootstrap', listener: (app: Application) => void): _cds

/**
	 * Emitted for each service served by cds.serve().
	 */
export function on (event: 'serving', listener: (srv: Service) => void): _cds

/**
	 * Emitted by the default, built-in `server.js` when all services are
	 * constructed and mounted by cds.serve().
	 */
export function on (event: 'served', listener: (all: cds_services) => void): _cds
export function once (event: 'served', listener: (all: cds_services) => void): _cds

/**
	 * Emitted by the default, built-in `server.js` when the http server
	 * is started and listening for incoming requests.
	 */
export function on (event: 'listening', listener: (args: { server: http.Server, url: string }) => void): _cds
export function once (event: 'listening', listener: (args: { server: http.Server, url: string }) => void): _cds

/**
	 * Emitted by the default, built-in `server.js` when the http server
	 * is shutdown.
	 */
export function on (event: 'shutdown', listener: () => void): _cds
export function once (event: 'shutdown', listener: () => void): _cds

/**
	 * Dictionary of all services constructed and/or connected.
	 */
export const services: cds_services

/**
	 * Shortcut to base class for all service definitions from linked models.
	 * Plus accessors to impl functions and constructed providers.
	 */
export const service: service

/**
   * Provides a graceful shutdown for running servers, by first emitting `cds.emit('shutdown')`.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-facade#cds-exit)
   */
export function exit (): void


export type service = {

  /**
	 * Dummy wrapper for service implementation functions.
	 * Use that in modules to get IntelliSense.
	 */
  impl (impl: ServiceImpl): typeof impl,
  // impl <T> (srv:T, impl: (  _cds: T, srv: (T) ) => any) : typeof impl

  /**
	 * Array of all services constructed.
	 */
  providers: Service[],
}

interface cds_serve_fluent {
  from (model: string | CSN): cds_serve_fluent
  to (protocol: string): cds_serve_fluent
  at (path: string): cds_serve_fluent
  in (app: Application): cds_serve_fluent
  with (impl: ServiceImpl | string): cds_serve_fluent
  // (req,res) : void
}

interface cds_connect_options {
  impl?: string
  service?: string
  kind?: string
  model?: string | CSN
  credentials?: object
}

type Middleswares = 'context' | 'trace' | 'auth' | 'ctx_model' | string

export const middlewares: {
  add: (middleware: RequestHandler, pos?: XOR<XOR<{ at: number }, { after: Middleswares }>, { before: Middleswares }>) => void,
}

/**
 * The {@link https://expressjs.com/en/4x/api.html#app| express.js application} constructed by the server implementation.
 *
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-server#cds-app)
 */
export const app: Application
