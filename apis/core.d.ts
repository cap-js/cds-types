import { LinkedAssociation, LinkedEntity, linked } from './linked'
import * as csn from './csn'
import { service } from './server'

type Intersect<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head & Intersect<Tail>
  : unknown

/**
 * Base class for linked Associations from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-Association)
 */
export interface Association extends LinkedAssociation {}
export declare class Association { constructor (_?: object) }

/**
 * Base class for linked Compositions from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-composition)
 */
export interface Composition extends Association {}
export declare class Composition { constructor (_?: object) }

/**
 * Base class for linked entities from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-entity)
 */
export interface entity extends LinkedEntity {}
export declare class entity { constructor (_?: object) }

export interface event extends linked, csn.struct {}
export class event { constructor (_?: object) }

export interface type extends linked, csn.type {}
export class type { constructor (_?: object) }

export interface array extends linked, csn.type {}
export class array { constructor (_?: object) }

export interface struct extends linked, csn.struct {}
export class struct { constructor (_?: object) }

// infer (query : cqn, model : csn) : LinkedDefinition
export const builtin: {

  /**
   * Base classes of linked definitions from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-builtin-classes)
   */
  classes: {
    Association: typeof Association,
    Composition: typeof Composition,
    entity: typeof entity,
    event: typeof event,
    type: typeof type,
    array: typeof array,
    struct: typeof struct,
    service: service,
  },
  types: Record<string, object>,
}

/**
 * Add aspects to a given object, for example:
 *
 * @example
 * ```js
 *    extend (Object.prototype) .with (class {
 *       get foo() { return ... }
 *       bar() {...}
 *    }.prototype)
 * ```
 */
export function extend<T> (target: T): {
  with<E extends readonly any[]>(...ext: E): T & Intersect<E>,
}

/**
 * Equip a given facade object with getters for lazy-loading modules instead
 * of static requires. Example:
 *
 * @example
 * ```js
 *    const facade = lazify ({
 *       sub: lazy => require ('./sub-module')
 *    })
 * ```
 *
 * The first usage of `facade.sub` will load the sub module
 * using standard Node.js's `module.require` functions.
 */
export function lazify<T> (target: T): T

/**
 * Prepare a node module for lazy-loading submodules instead
 * of static requires. Example:
 *
 * @example
 * ```js
 *    require = lazify (module) //> turns require into a lazy one
 *    const facade = module.exports = {
 *       sub: require ('./sub-module')
 *    })
 * ```
 *
 * The first usage of `facade.sub` will load the sub module
 * using standard Node.js's `module.require` functions.
 */
export function lazified<T> (target: T): T
