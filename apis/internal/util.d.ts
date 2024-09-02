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
