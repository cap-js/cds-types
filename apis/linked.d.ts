import { CSN, FQN, Association, Definition, entity, kinds } from './csn'

export type LinkedDefinition = linked & Definition & LinkedEntity & LinkedAssociation
export type Definitions = { [name: string]: LinkedDefinition }
// FIXME: this is only a temporary alias. Definitions is actually correct,
// but the name may be misleading, as it is indeed a mapping of strings to LinkedDefinition objects.
export type LinkedDefinitions = Definitions
export interface linked {
  is(kind: kinds | 'Association' | 'Composition'): boolean
  name: FQN
}

interface LinkedEntity extends linked, entity {
  keys: Definitions
  drafts?: LinkedEntity
}

interface LinkedAssociation extends linked, Association {
  is2one: boolean
  is2many: boolean
}

export interface LinkedCSN extends CSN {

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
  each(x: Filter, defs?: Definitions): IterableIterator<any>

  /**
	 * Fetches definitions matching the given filter, returning them in an array.
	 * Convenience shortcut for `[...reflect.each('entity')]`
	 */
  all(x: Filter, defs?: Definitions): any[]

  /**
	 * Fetches definitions matching the given filter, returning the first match, if any.
	 * @example
	 *      let service = model.find('service')
	 * @param x - the filter
	 * @param defs - the definitions to fetch in, default: `this.definitions`
	 */
  find(x: Filter, defs?: Definitions): any

  /**
	 * Calls the visitor for each definition matching the given filter.
	 * @see [capire](https://github.wdf.sap.corp/pages/cap/node.js/api#cds-reflect-foreach)
	 */
  foreach(x: Filter, visitor: Visitor, defs?: Definitions): this
  foreach(visitor: Visitor, defs?: Definitions): this

  /**
	 * Same as foreach but recursively visits each element definition
	 * @see [capire](https://github.wdf.sap.corp/pages/cap/node.js/api#cds-reflect-foreach)
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
  childrenOf(parent: any | string, filter?: ((def: LinkedDefinition) => boolean)): Definitions

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
  exports: Definitions & ((namespace: string) => Definitions)
  entities: Definitions & ((namespace: string) => Definitions)
  services: Definitions & ((namespace: string) => Definitions)
  definitions: Definitions

}

type Visitor = (def: LinkedDefinition, name: string, parent: LinkedDefinition, defs: Definitions) => void
type Filter = string | ((def: LinkedDefinition) => boolean)
