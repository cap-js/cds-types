import * as csn from '../csn'
import type { IterableMap } from '../internal/util'
import { kinds } from '../csn'

/**
 * @alpha
 * related to .protocols getters
 */
type Protocol = 'odata' | 'rest'
type Column = { ref: [string], as?: string }

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#iterable)
 */
export type LinkedDefinitions<T extends any_ = any_> = IterableMap<T> // & ((namespace: string) => LinkedDefinitions<T>)


interface WithElements {
  elements: LinkedDefinitions<type>
}

declare interface any_ extends csn.any_ {}
declare class any_<K extends kinds = kinds> {
  private _: K // break covariance
  constructor (...aspects: any[])

  readonly name: string
  // TODO: deprecated?
  is (kind: kinds | 'Association' | 'Composition'): boolean
}

declare class aspect<K extends kinds = 'aspect'> extends type<K> { }
declare interface type extends Omit<csn.type, 'items'> {
  items: type
}
declare class type<K extends kinds = 'type'> extends any_<K> { }

declare class scalar extends type { }
declare class boolean_ extends scalar { }
declare const boolean: typeof boolean_
declare class Boolean extends boolean { }

declare class string_ extends scalar { }
declare const string: typeof string_
declare class UUID extends string { }
declare class String extends string { }
declare class LargeString extends String { }
declare class Binary extends string { }
declare class LargeBinary extends Binary { }
declare class Vector extends Binary { }

declare class number_ extends scalar { }
declare const number: typeof number_
declare class Integer extends number { }
declare class UInt8 extends Integer { }
declare class Int16 extends Integer { }
declare class Int32 extends Integer { }
declare class Int64 extends Integer { }
declare class Float extends number { }
declare class Double extends Float { }
declare class Decimal extends Float { }

declare class date extends scalar { }
declare class Date extends date { }
declare class Time extends date { }
declare class DateTime extends date { }
declare class TimeStamp extends DateTime { }

declare class array extends type<'array'> { }

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-struct)
 */
declare interface struct extends csn.struct {}

declare class struct<K extends kinds = 'struct'> extends type<K> implements WithElements {
  is_struct: true

  elements: LinkedDefinitions<type<'type'>>
}

declare interface context extends csn.context {}
declare class context extends any_ { }

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-service)
 */
declare interface service extends csn.service {}
declare class service extends context {
  is_service: true
  get entities (): LinkedDefinitions<entity>
  get types (): LinkedDefinitions<type>
  get events (): LinkedDefinitions<event>
  get actions (): LinkedDefinitions<action>

  /**
   * @deprecated use `.actions` instead
   */
  get operations (): LinkedDefinitions<action>

  /**
   * @alpha
   * not public yet
   */
  get protocols (): { [protocol: Protocol]: boolean? }
}

declare class action extends any_<'action' | 'function'> {}
declare class event extends aspect<'event'> {}

// TODO: recursively change type of .elements? -> can come from struct
declare interface entity extends Omit<csn.entity, 'elements'> {}

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-entity)
 */
declare class entity extends struct<'entity'> {
  is_entity: true

  keys: LinkedDefinitions<type>

  associations: LinkedDefinitions<Association>

  compositions: LinkedDefinitions<Composition>

  actions: LinkedDefinitions<action>

  texts?: entity

  drafts?: entity
}

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-association)
 */
declare interface Association extends Omit<csn.Association, 'type'> {}
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
  foreignKeys: LinkedDefinitions<type>,
  keys: Column[],
}

/**
 * Using this will require you to explicitly cast all classes you added mixins to
 * to be able to access the additional properties. If you want to allow any additional
 * properties, you can use the {@link MixedIn} type.
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#mixin)
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
 * const s1 = new struct() as MixedIn<struct>
 * const s2 = new struct() as struct & { foo: string }  // better!
 * ```
 */
export type MixedIn<T> = T & { [key: string | number | symbol]: unknown }
