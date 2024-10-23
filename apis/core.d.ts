import type * as models from './models'

type Intersect<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head & Intersect<Tail>
  : unknown

export { entity, event, type, array, struct, Association, Composition } from './linked/classes'

// infer (query : cqn, model : csn) : LinkedDefinition
export const builtin: {

  /**
   * @see {@link models.linked.classes}
   */
  classes: typeof models.linked.classes,
  types: Record<string, object>, // FIXME: value should be any class part of linked.classes
}

/**
 * Add aspects to a given object, for example:
 *
 * @example
 * ```js
 *    extend (Object.prototype) .with (class {
 *       get foo() { return ... }
 *       bar() {...}
 *    }.prototype)
 * ```
 */
export function extend<T> (target: T): {
  with<E extends readonly any[]>(...ext: E): T & Intersect<E>,
}

/**
 * @deprecated since version 8.1
 */
export function lazify<T> (target: T): T

/**
 * @deprecated since version 8.1
 */
export function lazified<T> (target: T): T
