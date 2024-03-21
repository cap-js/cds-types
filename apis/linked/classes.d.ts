import type { TODO } from '../internal/util'

type Column = { ref: [string], as?: string }
type Kind = 'aspect' | 'entity' | 'type' | 'event' | 'action' | 'function' | 'struct' | 'array'

interface WithElements {
  elements: TODO // LinkedDefinitions_
}

declare class any_<K extends Kind = Kind> {
  private _: K // break covariance
  constructor (...aspects: any[])
  set name (n: string)
  set kind (k: string)
  get kind (): K | undefined
  valueOf (): string | this
  toJSON (): JSON
  own (property: TODO, ifAbsent: TODO): TODO
  set (property: string, value: any, enumerable?: boolean): TODO
  dataIn (d: TODO, prefix?: string): TODO
  // not public API yet
  // is (kind: Kind): boolean
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
declare class struct<K extends Kind = 'struct'> extends type<K> implements WithElements {
  data (d: TODO): TODO
  elements: TODO // LinkedDefinitions_<type<'type'>> // TODO: generic
}

declare class context extends any_ { }

declare class action extends any_<'action'> {} // TODO: class 'function' missing
declare class event extends aspect<'event'> {}

declare class entity extends struct<'entity'> {} // TODO: should this exist?
declare class Association extends type {}
declare class Composition extends Association {}

declare type ManagedAssociation = Association & {
  foreignKeys: TODO, //LinkedDefinitions_,
  keys: Column[],
}

export function mixin (...classes: (new () => any)[]): void
