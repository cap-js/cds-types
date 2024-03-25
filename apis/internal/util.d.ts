export type TODO = any

// "ArrayLike" is taken since es5
/**
 * A subset of array-like methods, but not `ArrayLike`, as it does not expose `.length`.
 * @see [capire](https://pages.github.tools.sap/cap/docs/node.js/cds-reflect#iterable)
 */
export type ArrayEsque<T> = Iterable<T> & {
  forEach: (handler: (element: T) => any) => void,
  filter: (predicate: (element: T) => boolean) => Array<T>,
  map: <R>(converter: (element: T) => R) => Array<R>,
  some: (predicate: (element: T) => boolean) => boolean,
  find: (predicate: (element: T) => boolean) => T | undefined,
}

export type IterableMap<T> = { [name: string]: T } & ArrayEsque<T>
