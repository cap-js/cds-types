import type { TODO } from '../internal/util'
// import { ModelPart } from '../linked' // TODO: this should actually be "LinkedDefinitions", see below

type Column = { ref: [string], as?: string }
type Kind = 'aspect' | 'entity' | 'type' | 'event' | 'action' | 'function' | 'struct' | 'array'

// ArrayLike is taken since es5
export type ArrayEsque<T> = Iterable<T> & {
  forEach: (handler: (element: T) => any) => void,
  filter: (predicate: (element: T) => boolean) => Array<T>,
  map: <R>(converter: (element: T) => R) => Array<R>,
  some: (predicate: (element: T) => boolean) => boolean,
  find: (predicate: (element: T) => boolean) => T | undefined,
}
export type IterableMap<T> = { [name: string]: T } & ArrayEsque<T>
export type LinkedDefinitions<T extends any_ = any_> = IterableMap<T> & ((namespace: string) => LinkedDefinitions<T>)

interface WithElements {
  elements: TODO // LinkedDefinitions_
}

// TODO: should this actually be called LinkedDefinition? Or aliased as such?
declare class any_<K extends Kind = Kind> {
  private _: K // break covariance
  constructor (...aspects: any[])
  get name (): string // TODO: actually getter, setter?
  get kind (): K | undefined
  valueOf (): string | this
  toJSON (): JSON
  own (property: TODO, ifAbsent: TODO): TODO
  set (property: string, value: any, enumerable?: boolean): TODO
  dataIn (d: TODO, prefix?: string): TODO
  // not public API yet
  // is (kind: Kind): boolean

  // needed to allow arbitrary properties to be added during runtime via mixin()
  [_: string | number | symbol]: unknown
}

declare class aspect<K extends Kind = 'aspect'> extends type<K> { }
declare class type<K extends Kind = 'type'> extends any_<K> { }

// FIXME: do scalar and its subclasses have their own, specific kind?
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
declare class struct<K extends Kind = 'struct'> extends type<K> implements WithElements {
  is_struct: true

  data (d: TODO): TODO // TODO: from impl?

  elements: LinkedDefinitions<any_> // TODO: can we already restrict generic parameter here?
}

declare class context extends any_ { }

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-service)
 */
declare class service extends context {
  is_service: true
  get entities (): LinkedDefinitions<entity>
  get types (): LinkedDefinitions<type>
  get events (): LinkedDefinitions<event>
  // TODO: missing in capire
  get actions (): LinkedDefinitions<action | any_<'function'>> // TODO: according to the impl this returns actions and functions. Should this be the case? See: operations
  // TODO: missing in capire
  get operations (): LinkedDefinitions<action | any_<'function'>>
  // TODO: missing in capire
  get protocols (): TODO

  // TODO: missing in capire (everything below)
  static get protocols (): TODO
  static get bindings (): TODO
  static get factory (): TODO
  static get endpoints4 (..._: TODO[]): TODO
  static get path4 (..._: TODO[]): TODO
}

declare class action extends any_<'action'> {} // TODO: class 'function' missing
declare class event extends aspect<'event'> {}

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-entity)
 */
declare class entity extends struct<'entity'> {
  is_entity: true

  keys: TODO

  associations: TODO

  compositions: TODO

  actions: TODO

  texts: TODO | undefined

  drafts: TODO
}

/**
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#cds-association)
 */
declare class Association extends type {
  _target: TODO

  isAssociation: true // TODO: why not is_association here?

  isComposition?: true // TODO: ?: true or bool? move to Composition?

  is2One: boolean

  is2Many: boolean

  keys: Column[]

  foreignKeys: TODO
}

// TODO: should this exist? same as association in capire?
declare class Composition extends Association {}

declare type ManagedAssociation = Association & {
  foreignKeys: TODO, //LinkedDefinitions_,
  keys: Column[],
}

// TODO: using this will break the existing types
export function mixin (...classes: (new () => any)[]): void
