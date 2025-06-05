// This file contains dummy data that is used
// to test cds components.
// The definitions in here are not part of cds itself.

// dummies to test singular and plural types in queries with
export class Foo {
    static readonly drafts: typeof Foo
    x: number = 42
    y?: string
    ref?: Foo
    refs?: Foo[]
  }

export class Foos extends Array<Foo> { static readonly drafts: typeof Foo }

export class Bar {
  static readonly drafts: typeof Bar
  name: string = "bar"
}

export class Bars extends Array<Bar> { static readonly drafts: typeof Foo }


// for bound/ unbound actions
export const action = ((foo: Foo) => 42) as Action
export type Action = {
  (foo: Foo): number,
  __parameters: {foo: Foo},
  __returns: number
}

// little 'trust me, type system!' helper to make T|undefined into T.
// useful for tricking the type system into accepting uninitialised properties
// from classes (e.g. Foo.x) in definitely attached parameters.
export const attach = <T>(x?: T): T => x as T

// wrapper to get rid of all the "undefined as unknown as Foo"
export const as = <T>() => undefined as unknown as T

// test utility to replace "const x: T = foo()" with "testType<T>(foo())"
export const testType = <T>(x: T) => {}
