/** @internal */
export type _TODO = any

/**
 * https://stackoverflow.com/a/53229567
 * @internal
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/** @internal */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

/**
 * Object structure that exposes both array-like and object-like behaviour.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable)
 */

export type IterableMap<T> = { [name: string]: T } & Iterable<T>

/**
 * T is a tuple of alternating K, V pairs -> true, else false
 * Allows for variadic parameter lists with alternating expecing types,
 * like we have in cql.SELECT.where
 */
type KVPairs<T,K,V> = T extends []
  ? true
  : T extends [K, V, ...infer R]
    ? KVPairs<R,K,V>
    : false

/**
 * Recursively excludes nullability from all properties of T.
 */
export type DeepRequired<T> = { 
  [K in keyof T]: DeepRequired<T[K]>
} & Exclude<Required<T>, null>


/**
 * - `IsAny<any>` -> `true`:  `1 & any` is `any`, so `0 extends any` is `true`.
 * - `IsAny<anything but any>` -> `false`:
 * `1 & T` is never `any`, so `0 extends (1 & T)` is `false`.
 * @internal
 */
export type IsAny<T> = 0 extends (1 & T) ? true : false;
