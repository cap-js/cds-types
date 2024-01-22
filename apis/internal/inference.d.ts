// Types in this file are not part of the API.
// They are merely meant as definitions that are used
// in several places within the API.


export interface Constructable<T = any> {
  new(...args: any[]): T
}

// any class (not value) of array to represent plural types used in cds-typer.
// Mainly used as pattern match for SingularType
// type ArrayConstructable = Constructable<Array<any>>
export interface ArrayConstructable<T = any> {
  new(...args: any[]): T[]
}

// concrete singular type.
// `SingularType<typeof Books>` == `Book`.
export type SingularType<T extends ArrayConstructable<T>> = InstanceType<T>[number]

// Convenient way of unwrapping the inner type from array-typed values, as well as the value type itself
// `class MyArray<T> extends Array<T>``
// The latter is used heavily in the CDS typer, but its behaviour depends based on how the types are imported:
// If they are imported on a value based (`require('path/to/type')`) they will be considered `ArrayConstructable`.
// But if they are being used on type level (JSDOC: `/* @type {import('path/to/type')} */`) they are considered an `Array` .
// This type introduces an indirection that streamlines their behaviour for both cases.
// For any scalar type `Unwrap` behaves idempotent.
export type Unwrap<T> = T extends ArrayConstructable
  ? SingularType<T>
  : T extends Array<infer U>
    ? U
    : T


/*
 * the following three types are used to convert union types to intersection types.
 * We need these as our types currently lack generics in places where we would need them to clearly decide
 * on a subtype in the case of a union type. This leads to the following problem:
 *
 * ```ts
 * type A = { a: number }
 * type B = { b: string }
 * type Foo = A | B
 * function f(): Foo { ... }
 * const x = f()
 * x.a  // error, could also be B
 * ```
 *
 * While we should have:
 *
 * ```ts
 * function f<T extends Foo>(): T { ... }
 * const x = f<A>()
 * x.a
 * ```ts
 *
 * Since we don't do that yet, we opt for intersection types instead.
 * By also wrapping it in Partial, we at least force the user to check for the presence of any
 * attribute they try to access.
 *
 * Places where these types are used are subject to a rework!
 * the idea behind the conversion can be found in this excellent writeup: https://fettblog.eu/typescript-union-to-intersection/
 */
export type Scalarise<A> = A extends Array<infer N> ? N : A
export type UnionToIntersection<U> = Partial<(U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never>
export type UnionsToIntersections<U> = Array<UnionToIntersection<Scalarise<U>>>
