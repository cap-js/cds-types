// Types in this file are not part of the API.
// They are merely meant as definitions that are used
// in several places within the API.


export interface Constructable<T = any> {
	new(...args: any[]): T
}

// any class (not value) of array to represent plural types used in cds-typer.
// Mainly used as pattern match for SingularType
//type ArrayConstructable = Constructable<Array<unknown>>
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
