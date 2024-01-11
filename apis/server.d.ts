/* eslint-disable @typescript-eslint/ban-types */
import { Service, ServiceImpl } from './services'
import { CSN } from './csn'
import * as http from 'http'
import * as cds from './cds'
import { Application } from 'express'

type _cds = typeof cds

export const connect: {

  /**
		 * Connects to a specific datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
		 */
  to(datasource: string, options?: cds_connect_options): Promise<Service>,

  /**
		 * Connects to a specific datasource via options.
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


type cds_services = { [name: string]: Service }

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
  model?: string
  credentials?: object
}
