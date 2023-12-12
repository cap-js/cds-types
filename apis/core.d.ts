import { LinkedAssociation, LinkedEntity, linked } from './linked'
import * as csn from './csn'
import { service } from './server'

type Intersect<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head & Intersect<Tail>
  : unknown

// These are classes actually -> using the new() => interface trick
/**
 * Base class for linked Associations from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-Association)
 */
export type Association = new(_?:object) => LinkedAssociation
/**
 * Base class for linked Compositions from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-Association)
 */
export type Composition = new(_?:object) => LinkedAssociation
/**
 * Base class for linked entities from reflected models.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-entity)
 */
export type entity = new(_?:object) => LinkedEntity
export type event = new(_?:object) => linked & csn.struct
export type type = new(_?:object) => linked & csn.type
export type array = new(_?:object) => linked & csn.type
export type struct = new(_?:object) => linked & csn.struct

// infer (query : cqn, model : csn) : LinkedDefinition
export const builtin: {
  /**
   * Base classes of linked definitions from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-builtin-classes)
   */
  classes: {
    Association: Association
    Composition: Composition
    entity: entity
    event: event
    type: type
    array: array
    struct: struct
    service: service
  }
  types: {}
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
export function extend<T>(target: T): {
  with<E extends readonly unknown[]>(...ext: E): T & Intersect<E>
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
export function lazify <T>(target: T) : T

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
export function lazified <T>(target: T) : T
