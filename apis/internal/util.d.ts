/** @internal */
export type _TODO = any

/**
 * https://stackoverflow.com/a/53229567
 * @internal
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/** @internal */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

// "ArrayLike" is taken since es5, so the underscore is both for @internal and to avoid clashes
/**
 * A subset of array-like methods, but not `ArrayLike`, as it does not expose `.length`.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable)
 * @internal
 * @since cds 7.9
 */
export type _ArrayLike<T> = Iterable<T> & {
  forEach: (handler: (element: T) => any) => void,
  filter: (predicate: (element: T) => boolean) => Array<T>,
  map: <R>(converter: (element: T) => R) => Array<R>,
  some: (predicate: (element: T) => boolean) => boolean,
  find: (predicate: (element: T) => boolean) => T | undefined,
}

/**
 * Object structure that exposes both array-like and object-like behaviour.
 * @see [capire](https://cap.cloud.sap/docs/node.js/cds-reflect#iterable)
 */
export type IterableMap<T> = { [name: string]: T } & _ArrayLike<T>

// 
/**
 * T is a tuple of alternating K, V pairs -> true, else false
 * Allows for variadic parameter lists with alternating expecing types,
 * like we have in cql.SELECT.where
 */
type KVPairs<T,K,V> = T extends []
  ? true
  : T extends [K, V, ...infer T]
    ? KVPairs<T,K,V>
    : false
