/**
 * @internal
 */
export type _TODO = any

// "ArrayLike" is taken since es5, so the underscore is both for @internal and to avoid clashes
/**
 * A subset of array-like methods, but not `ArrayLike`, as it does not expose `.length`.
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#iterable)
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
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#iterable)
 */
export type IterableMap<T> = { [name: string]: T } & _ArrayLike<T>
