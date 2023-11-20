import { LinkedAssociation, LinkedEntity, linked } from './linked'
import * as csn from './csn'
import { service } from './server'

// These are classes actually -> using the new() => interface trick
export type Association = new() => LinkedAssociation
export type Composition = new() => LinkedAssociation
export type entity = new() => LinkedEntity
export type event = new() => linked & csn.struct
export type type = new() => linked & csn.type
export type array = new() => linked & csn.type
export type struct = new() => linked & csn.struct

export default class cds {
  // infer (query : cqn, model : csn) : LinkedDefinition

  builtin: {
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
   * Base class for linked Associations from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-Association)
   */
  Association: Association

  /**
   * Base class for linked Compositions from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-Association)
   */
  Composition: Composition

  /**
   * Base class for linked entities from reflected models.
   * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-entity)
   */
  entity: entity

  event: event
  type: type
  array: array
  struct: struct

  /**
   * Add aspects to a given object, for example:
   *
   *    extend (Object.prototype) .with (class {
   *       get foo() { return ... }
   *       bar() {...}
   *    }.prototype)
   */
  extend<T>(target: T): {
    with<E extends readonly unknown[]>(...ext: E): T & Intersect<E>
  }

  /**
   * Equip a given facade object with getters for lazy-loading modules instead
   * of static requires. Example:
   *
   *    const facade = lazify ({
   *       sub: lazy => require ('./sub-module')
   *    })
   *
   * The first usage of `facade.sub` will load the sub module
   * using standard Node.js's `module.require` functions.
   */
  lazify <T>(target: T) : T

  /**
   * Prepare a node module for lazy-loading submodules instead
   * of static requires. Example:
   *
   *    require = lazify (module) //> turns require into a lazy one
   *    const facade = module.exports = {
   *       sub: require ('./sub-module')
   *    })
   *
   * The first usage of `facade.sub` will load the sub module
   * using standard Node.js's `module.require` functions.
   */
  lazified <T>(target: T) : T

}

type Intersect<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head & Intersect<Tail>
  : unknown
