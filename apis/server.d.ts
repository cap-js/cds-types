import { Service, ServiceImpl } from "./services"
import { CSN } from "./csn"
import * as http from "http"
import { Application } from "express"

export default class cds {

	connect: {
		/**
		 * Connects to a specific datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
		 */
		to(datasource: string, options?: cds_connect_options): Promise<Service>

		/**
		 * Connects to a specific datasource via options.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect#cds-connect-to)
		 */
		to(options: cds_connect_options): Promise<Service>

		/**
		 * Connects the primary datasource.
		 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-connect)
		 */
		(options?: string | cds_connect_options): Promise<typeof cds>  //> cds.connect(<options>)
	}

	/**
	 * The default bootstrap function as loaded from server.js
	 */
	server: Function

	/**
	 * Constructs service providers from respective service definitions
	 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-serve)
	 */
	serve (service : string, options?: {
		service?: string,
		from?: '*' | 'all' | string,
		[key: string]: unknown
	}) : Promise<cds_services> & cds_serve_fluent


	/**
	 * Emitted whenever a specific service is connected for the first time.
	 */
	on(event: 'connect', listener: (srv: Service) => void): this


	/**
	 * Emitted at the very beginning of the bootsrapping process, when the
	 * express application has been constructed but no middlewares or routes
	 * added yet.
	 */
	on (event : 'bootstrap', listener : (app : Application) => void) : this
	once (event : 'bootstrap', listener : (app : Application) => void) : this

	/**
	 * Emitted for each service served by cds.serve().
	 */
	on (event : 'serving', listener : (srv : Service) => void) : this

	/**
	 * Emitted by the default, built-in `server.js` when all services are
	 * constructed and mounted by cds.serve().
	 */
	on   (event : 'served', listener : (all : cds_services) => void) : this
	once (event : 'served', listener : (all : cds_services) => void) : this

	/**
	 * Emitted by the default, built-in `server.js` when the http server
	 * is started and listening for incoming requests.
	 */
	on   (event : 'listening', listener : (args : { server: http.Server, url:string }) => void) : this
	once (event : 'listening', listener : (args : { server: http.Server, url:string }) => void) : this

	/**
	 * Emitted by the default, built-in `server.js` when the http server
	 * is shutdown.
	 */
	on (event : 'shutdown', listener : () => void) : this
	once (event : 'shutdown', listener : () => void) : this

	/**
	 * Dictionary of all services constructed and/or connected.
	 */
	services : cds_services

	/**
	 * Shortcut to base class for all service definitions from linked models.
	 * Plus accessors to impl functions and constructed providers.
	 */
	service : service

  /**
   * Provides a graceful shutdown for running servers, by first emitting `cds.emit('shutdown')`.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-facade#cds-exit)
   */
  exit(): void

}

export type service = {
	/**
	 * Dummy wrapper for service implementation functions.
	 * Use that in modules to get IntelliSense.
	 */
	impl (impl: ServiceImpl) : typeof impl
	// impl <T> (srv:T, impl: ( this: T, srv: (T) ) => any) : typeof impl

	/**
	 * Array of all services constructed.
	 */
	providers : Service[]
}


type cds_services = { [name:string]: Service }

interface cds_serve_fluent {
	from (model : string | CSN) : this
	to (protocol: string) : this
	at (path: string) : this
	in (app: Application) : this
	with (impl: ServiceImpl | string) : this
	// (req,res) : void
}

interface cds_connect_options {
	impl?: string,
	service?: string,
	kind?: string,
	model?: string,
	credentials?: object
}
