import * as csn from './csn'
import { IterableMap } from './internal/util'
import { Definitions, any_, entity, service_ } from './linked/classes'

// TODO: the function usage for services is not documented and will be removed with cds^10
export type ModelPart<T extends any_> = IterableMap<T> & ((namespace: string) => IterableMap<T>)
type Visitor = (def: any_, name: string, parent: any_, defs: Definitions) => void
type Filter = string | (<T extends any_ = any_>(def: T) => boolean)

export type Definition = any_

export interface LinkedCSN extends Omit<csn.CSN, 'definitions'> {

  /**
	 * Fetches definitions matching the given filter, returning an iterator on them.
	 * @example
	 * ```js
	 *   let m = cds.reflect (aParsedModel)
	 *   for (let d of m.each('entity'))  console.log (d.kind, d.name)
	 *   let entities = [...m.each('entity')]  //> capture all
	 *   let entities = m.all('entity')        //> equivalent shortcut
	 * ```
	 */
  each<T extends any_>(x: Filter, defs?: Definitions<T>): IterableIterator<T>

  /**
	 * Fetches definitions matching the given filter, returning them in an array.
	 * Convenience shortcut for `[...reflect.each('entity')]`
	 */
  all<T extends any_>(x: Filter, defs?: Definitions<T>): T[]

  /**
	 * Fetches definitions matching the given filter, returning the first match, if any.
	 * @example
	 *      let service = model.find('service')
	 * @param x - the filter
	 * @param defs - the definitions to fetch in, default: `this.definitions`
	 */
  find<T extends any_>(x: Filter, defs?: Definitions<T>): T | undefined

  /**
	 * Calls the visitor for each definition matching the given filter.
	 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#foreach)
	 */
  foreach(x: Filter, visitor: Visitor, defs?: Definitions): this
  foreach(visitor: Visitor, defs?: Definitions): this

  /**
	 * Same as foreach but recursively visits each element definition
	 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#foreach)
	 */
  forall(x: Filter, visitor: Visitor, defs?: Definitions): this
  forall(visitor: Visitor, defs?: Definitions): this

  /**
	 * Fetches definitions declared as children of a given parent context or service.
	 * It fetches all definitions whose fully-qualified names start with the parent's name.
	 * Returns the found definitions as an object with the local names as keys.
	 * @example
	 * ```js
	 *   let service  = model.find ('service')
	 *   let entities = m.childrenOf (service)
	 * ```
	 * @param parent - either the parent itself or its fully-qualified name
	 * @param filter - an optional filter to apply before picking a child
	 */
  childrenOf(parent: any | string, filter?: ((def: any_) => boolean)): Definitions

  /**
	 * Provides convenient access to the model's top-level definitions.
	 * For example, you can use it in an es6-import-like fashion to avoid
	 * working with fully-qualified names as follows:
	 *
	 * @example
	 * ```js
	 * let model = cds.reflect (cds.parse(`
	 *     namespace our.lovely.bookshop;
	 *     entity Books {...}
	 *     entity Authors {...}
	 * `))
	 * const {Books,Authors} = model.exports
	 * SELECT.from (Books) .where ({ID:11})
	 * ```
	 */
  exports: IterableMap<any_>
  definitions: IterableMap<any_>
  entities: ModelPart<entity>
  services: ModelPart<service_>

}

// for any changes, see models.d.ts linked!
import * as classes from './linked/classes'
export { classes }
