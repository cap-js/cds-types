/**
 * @privateRemarks
 * These classes represent the components of the model after being run through cds.linked.
 * They mirror the class hierarchy of the original CSN, but also inherit the original CSN class
 * of the same name. So we have to resolve a diamond inheritance problem here:
 * ```
 * csn.type   <-- linked.type
 *   ^               ^
 * csn.struct <-- linked.struct
 *   ^               ^
 * csn.entity <-- linked.entity
 * ```
 * To address this, we use declaration merging to express the relationship between csn.X and linked.X
 * while using regular inheritance for the classes in the linked namespace.
 * As we also have to adjust the types of some of the properties accordingly from csn.Y to linked.Y,
 * we have explicitly take away some of the properties using `Omit<...>`
 * and redeclare them with the proper type.
 */

import * as csn from '../csn'
import type { IterableMap } from '../internal/util'
import type { number_, string_, boolean_ } from './internal'
import { kinds } from '../csn'

/**
 * @alpha
 * related to .protocols getters
 */
type Protocol = 'odata' | 'rest'
type Column = { ref: [string], as?: string }

/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable)
 */
export type Definitions<T extends any_ = any_> = IterableMap<T>

interface WithElements {
  elements: Definitions<type>
}

declare interface any_ extends csn.any_ {}
declare class any_<K extends kinds = kinds> {
  private _: K // break covariance
  constructor (...aspects: any[])

  readonly name: string
  // parked, might be deprecated
  // is (kind: kinds | 'Association' | 'Composition'): boolean
}

declare const any: typeof any_

declare class aspect<K extends kinds = 'aspect'> extends type<K> implements WithElements {
  elements: Definitions<type<'type'>>
}
declare interface type extends Omit<csn.type, 'items'> {
  items?: type
  key?: boolean
  notNull?: boolean
  virtual?: boolean
}
declare class type<K extends kinds = 'type'> extends any_<K> { }

declare class scalar extends type { }
declare const boolean: typeof boolean_
declare class Boolean extends boolean { }

declare const string: typeof string_
declare class UUID extends string { }
declare class String extends string { }
declare class LargeString extends String { }
declare class Binary extends string { }
declare class LargeBinary extends Binary { }
declare class Vector extends Binary { }

// declare class number_ extends scalar { }
declare const number: typeof number_
declare class Integer extends number { }
declare class UInt8 extends Integer { }
declare class Int16 extends Integer { }
declare class Int32 extends Integer { }
declare class Int64 extends Integer { }
declare class Float extends number { }
declare class Double extends Float { }
declare class Decimal extends Float { 
  precision?: number
  scale?: number
}

declare class date extends scalar { }
declare class Date extends date { }
declare class Time extends date { }
declare class DateTime extends date { }
declare class TimeStamp extends DateTime { }

declare class array extends type<'type' | 'elements'> { }

/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-struct)
 */
declare interface struct extends Omit<csn.struct, 'items' | 'elements'> {}
declare class struct<K extends kinds = 'elements' | 'type'> extends type<K> implements WithElements {
  is_struct: true

  elements: Definitions<type<'type'>>
}

/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-entity)
 */
declare interface Map extends csn.Map {}
declare class Map extends Omit<struct, 'items'> {}

// clashes with services.context when exported from facade
declare interface context_ extends csn.context {}
declare class context_ extends any_ { }

// clashes with server.service when exported from facade
/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-service)
 */
declare interface service_ extends csn.service {}
declare class service_ extends context_ {
  is_service: true
  get entities (): Definitions<entity>
  get types (): Definitions<type>
  get events (): Definitions<event>
  get actions (): Definitions<action>

  /**
   * @deprecated use `.actions` instead
   */
  get operations (): Definitions<action>

  /**
   * @alpha
   * not public yet
   */
  get protocols (): { [protocol in Protocol]?: boolean | undefined }
}

declare class action extends any_<'action' | 'function'> {}
declare class event extends aspect<'event'> {}

/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-entity)
 */
declare interface entity extends Omit<csn.entity, 'elements' | 'items' | 'keys' | 'drafts'> {}
declare class entity extends struct<'entity'> {
  is_entity: true

  keys: Definitions<type>

  associations: Definitions<Association>

  compositions: Definitions<Composition>

  actions: Definitions<action>

  texts?: entity

  drafts?: entity
}

/**
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#cds-association)
 */
declare interface Association extends Omit<csn.Association, 'type' | 'items'> {}
declare class Association extends type {
  _target: entity

  isAssociation: true

  is2one: boolean

  is2many: boolean

}

declare class Composition extends Association {
  isComposition: true
}

declare type ManagedAssociation = Association & {
  foreignKeys: Definitions<type>,
  keys: Column[],
}

/**
 * Using this will require you to explicitly cast all classes you added mixins to
 * to be able to access the additional properties. If you want to allow any additional
 * properties, you can use the {@link MixedIn} type.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#mixin)
 */
export function mixin (...classes: (new () => any)[]): void

/**
 * Allows arbitrary property access. Can be used for explicitly casting
 * classes you have added {@link mixin}s to.
 * Use with caution, as the type system will no longer
 * warn you about possibly missing properties.
 * @example
 * ```ts
 * mixin(class struct { foo: string }))
 *
 * const s1 = new struct() as MixedIn<struct>
 * s1.is_struct
 * s1.foo
 * s1.bar  // no error, despite not being defined :(
 *
 * const s2 = new struct() as struct & { foo: string }  // better!
 * s2.is_struct
 * s2.foo
 * s2.bar  // error :)
 * ```
 */
export type MixedIn<T> = T & { [key: string | number | symbol]: unknown }
