import { service } from './server'
import * as linked from './linked'

type Intersect<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head & Intersect<Tail>
  : unknown

export { entity, event, type, array, struct, Association, Composition } from './linked/classes'

// infer (query : cqn, model : csn) : LinkedDefinition
export const builtin: {

  /**
   * Base classes of linked definitions from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-builtin-classes)
   */
  classes: {
    Association: typeof linked.Association,
    Composition: typeof linked.Composition,
    entity: typeof linked.entity,
    event: typeof linked.event,
    type: typeof linked.type,
    array: typeof linked.array,
    struct: typeof linked.struct,
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
