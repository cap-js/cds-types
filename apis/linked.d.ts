import { CSN } from './csn'
import { IterableMap } from './internal/util'
import { LinkedDefinitions, any_, entity, service } from './linked/classes'

export type ModelPart<T extends any_> = IterableMap<T> & ((namespace: string) => IterableMap<T>)
type Visitor = (def: any_, name: string, parent: any_, defs: LinkedDefinitions) => void
type Filter = string | (<T extends any_ = any_>(def: T) => boolean)

export type LinkedDefinition = any_

export interface LinkedCSN extends Omit<CSN, 'definitions'> {

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
  each<T extends any_>(x: Filter, defs?: LinkedDefinitions<T>): IterableIterator<T>

  /**
	 * Fetches definitions matching the given filter, returning them in an array.
	 * Convenience shortcut for `[...reflect.each('entity')]`
	 */
  all<T extends any_>(x: Filter, defs?: LinkedDefinitions<T>): T[]

  /**
	 * Fetches definitions matching the given filter, returning the first match, if any.
	 * @example
	 *      let service = model.find('service')
	 * @param x - the filter
	 * @param defs - the definitions to fetch in, default: `this.definitions`
	 */
  find<T extends any_>(x: Filter, defs?: LinkedDefinitions<T>): T | undefined

  /**
	 * Calls the visitor for each definition matching the given filter.
	 * @see [capire](https://github.wdf.sap.corp/pages/cap/node.js/api#cds-reflect-foreach)
	 */
  foreach(x: Filter, visitor: Visitor, defs?: LinkedDefinitions): this
  foreach(visitor: Visitor, defs?: LinkedDefinitions): this

  /**
	 * Same as foreach but recursively visits each element definition
	 * @see [capire](https://github.wdf.sap.corp/pages/cap/node.js/api#cds-reflect-foreach)
	 */
  forall(x: Filter, visitor: Visitor, defs?: LinkedDefinitions): this
  forall(visitor: Visitor, defs?: LinkedDefinitions): this

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
  childrenOf(parent: any | string, filter?: ((def: any_) => boolean)): LinkedDefinitions

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
  services: ModelPart<service>

}

// FIXME: only for compat in ql.d.ts and services.d.ts, remove asap
export type LinkedEntity = entity
