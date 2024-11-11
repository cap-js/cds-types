import { QLExtensions } from '../../../../apis/ql'
import { Foo, Foos, attach } from './dummy'

// @ts-expect-error - only supposed to be used statically, constructors private
new SELECT;
// @ts-expect-error
new INSERT;
// @ts-expect-error
new UPDATE;
// @ts-expect-error
new UPSERT;
// @ts-expect-error
new DELETE;
// @ts-expect-error
new CREATE; 
// @ts-expect-error
new DROP;

// unwrapped plural types
let sel: SELECT<Foos>
sel = SELECT(Foo)
sel = SELECT(Foo.drafts)
sel = SELECT(Foos.drafts)
sel = SELECT.from(Foo.drafts)
sel = SELECT.from(Foos.drafts)

let selSingular: SELECT<Foo> = undefined as unknown as SELECT<Foo>
selSingular.columns('ref')  // auto suggested

let selAny: SELECT<any> = undefined as unknown as SELECT<Foo>
selAny.columns('asd')  // unclear target, any string is allowed

const selStatic: SELECT<Foos> | Promise<Foos> = SELECT.from(Foos)

 // x was suggested by code completion
SELECT.from(Foos).columns('x')
sel.from(Foos).columns('x')
sel.from(Foo).columns('x')
sel.columns("x")

// y is not a valid columns for Foo(s),
// but is allowed anyway since we permit arbitrary strings as well
SELECT.from(Foos).columns('y')
SELECT.from(Foos).where('x=', 42)
SELECT.from(Foos).where('x >', 42, 'y =', '42')
const predefinedArray = [42]
SELECT.from(Foos).where('x in', [42])
SELECT.from(Foos).where('x in', predefinedArray)
SELECT.from(Foos).where('x in', SELECT.from(Foos))
// @ts-expect-error - can't just use anything as even parameter
SELECT.from(Foos).where('x in', Foos)
SELECT.from(Foos).where('fn(x) = ', 42)
sel.from(Foos).columns('y')
sel.from(Foo).columns('y')
sel.columns("y")
SELECT.from(Foos, f => f.ref(r => r.x))  // ref should be callable without optional chaining (DeepRequired)

SELECT.from(Foos).orderBy('x')  // x auto completed
SELECT.from(Foos).orderBy('y')  // non-columns also still possible

SELECT.from(Foos, f => { 
    f.x,
    // @ts-expect-error - foobar is not a valid column
    f.foobar
})

sel.SELECT.columns?.filter(e => !e) // check if this is array

sel.from(Foos).where({ ref:42 })  // ref was suggested by code completion
sel.from(Foos).where({ zef:42 })  // non-keys are allowed too

// ensure ql returns a proper CQN
const s = SELECT.from(Foos).columns('x').where('x=', 42)
SELECT.from(Foo).columns('x').where('x=', 42)
SELECT.from(Foo).columns('x').where('y=', 42)  // also allowed as per [string, Primitive] signature
// @ts-expect-error invalid key type
SELECT.from(Foo).columns('x').where([new Foo()], 42)
// @ts-expect-error missing operator
SELECT.from(Foo).columns('x').where('y', 42)
s.SELECT.from.ref
s.SELECT.columns?.[0].ref
s.SELECT.where?.[0].ref
s.SELECT.where?.[2].val
SELECT.from(Foo).columns('x').where('x =', 42)

SELECT(Foos) === SELECT.from(Foos)

INSERT.into(Foos).columns("x") // x was suggested by code completion
let ins: INSERT<Foo>
ins = INSERT.into(Foos, {})
ins.into(Foos)
ins.into(Foos)
ins.columns("x") // x was suggested by code completion
ins.INSERT.into === "foo"
INSERT.into("Bla").as(SELECT.from("Foo"))

let upd: UPDATE<Foos>
upd = UPDATE(Foo, 42)
upd.set({})
upd = UPDATE.entity(Foos)
upd.set({})
upd.UPDATE.entity === "foo"

let ups:UPSERT<Foo>
ups = UPSERT.into(Foo)
ups.UPSERT.columns.filter(e => !e)

const del: DELETE<Foo> = DELETE.from(Foos)
del.byKey(21)
del.DELETE.from === "foo"
DELETE(Foo)
DELETE(Foo, Foos)
DELETE([Foo, Foos])

let selectOne: Foo
let selectMany: Foos

// SINGULAR TESTS
selectOne = await SELECT.from(Foos.drafts, 42) // .drafts of plural still singular
selectOne = await SELECT.from(Foo.drafts, 42)
selectOne = await SELECT(Foo, 42)
// explicitly select one
selectOne = await SELECT.one.from(Foo)
selectOne = await SELECT.one.from(Foo, 42)
selectOne = await SELECT.one.from(Foo, 42)
selectOne = await SELECT.one.from(Foo, 42, f => f.x)
selectOne = await SELECT.one.from(Foo, f => f.x)
selectOne = await SELECT.one.from(Foo).alias('Bars')
// implicitly select one by specifying a key
selectOne = await SELECT.from(Foo, 42)
selectOne = await SELECT.from(Foo, 42, ["x"])
selectOne = await SELECT.from(Foo, 42, (f: Foo) => f.x)

selectMany = await SELECT.from(Foo)
selectMany = await SELECT.from(Foo, (f: Foo) => f.x)
selectMany = await SELECT.from(Foo).alias('Bars')
await SELECT.from(Foo, f => attach(f.ref)('*'))

// PLURAL TESTS
selectOne = await SELECT(Foos, 42)
// explicitly select one
selectOne = await SELECT.one.from(Foos)
selectOne = await SELECT.one.from(Foos, 42)
selectOne = await SELECT.one.from(Foos, 42, f => f.x)
selectOne = await SELECT.one.from(Foos, f => f.x)
selectOne = await SELECT.one.from(Foos).alias('Bars')
// implicitly select one by specifying a key
selectOne = await SELECT.from(Foos, 42)
selectOne = await SELECT.from(Foos, 42)
selectOne = await SELECT.from(Foos, 42, (f: Foo) => f.x)

selectMany = await SELECT.from(Foos)
selectMany = await SELECT.from(Foos, (f: Foo) => f.x)
selectMany = await SELECT.from(Foos).alias('Bars')
await SELECT.from(Foos, f => attach(f.ref)('*'))

// Localized queries
// explicitly select one
selectOne = await SELECT.one.localized(Foos)
selectOne = await SELECT.one.localized(Foos, 42)

// implicitly select one by specifying a key
selectOne = await SELECT.from.localized(Foos, 42)
selectOne = await SELECT.from.localized(Foos, 42, (f) => f.x)
selectOne = await SELECT.localized.from(Foos, 42)
selectOne = await SELECT.localized.from(Foos, 42, (f) => f.x)
selectOne = await SELECT.localized(Foos, 42)
selectOne = await SELECT.localized(Foos, 42, (f) => f.x)

selectMany = await SELECT.from.localized(Foos)
selectMany = await SELECT.from.localized(Foos).columns('x')
selectMany = await SELECT.localized.from(Foos)
selectMany = await SELECT.localized(Foos)
selectMany = await SELECT.localized(Foos).columns('x')

// projections (with Plural type, which should make the parameter a Singular)
SELECT.from(Foos, f => {
    const iterator: QLExtensions<Foo> = f
    // apply CQL functions
    f.get('')
    f.as('asd')
    // subselect on scalar properties
    f.ref!(inner => inner.ref!(innermost => innermost.x))
    f.ref!('*')
    // subselect on non-scalar properties
    f.refs!(inner => inner.refs!(innermost => innermost.x))
    f.refs!(inner => inner.refs!(innermost => innermost.x))
    const number: QLExtensions<number> = f.x
    number.get('')  // CQL functions work for simple types too
})

SELECT.from(Foos).columns(f => {
    const iterator: QLExtensions<Foo> = f
    const number: QLExtensions<number> = f.x
})

// and with singular types (or any other type for which we can not infer a Singular)
// f is implicitly any, which TS complains about, so we type it to any explicitly.
SELECT.from(Foos, (f:any) => {
    const iterator: QLExtensions<Foo> = f
    const number: QLExtensions<number> = f.x
})

SELECT.columns`a`.from`Foo`;

SELECT.from(Foos).columns(f => {
    const iterator: QLExtensions<Foo> = f
    const number: QLExtensions<number> = f.x
})

// @ts-expect-error invalid key of result line
SELECT.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r[0].some)
SELECT.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r[0].ref)
// @ts-expect-error invalid key of result line
SELECT.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r[0].some)
SELECT.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r[0].ref)
// @ts-expect-error invalid key of result line
SELECT.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r[0].some)
SELECT.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r[0].ref)
// @ts-expect-error invalid key of result line
SELECT.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r[0].some)
SELECT.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r[0].ref)

SELECT.from `Books` .columns ( 'title', {ref:['author','name'],as:'author'} )
SELECT.from `Books` .columns (['title', {ref:['author','name'],as:'author'} ])

// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r.some)
SELECT.one.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r.some)
SELECT.one.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r.some)
SELECT.one.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r.some)
SELECT.one.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r.ref)

INSERT.into(Foos).values([1,2,3])

// tagged template strings
// literal
SELECT `a, b` .from `Books` .where `x = 42`
SELECT.one.from `Books` .where `ID=201`
INSERT.into `Books` .entries ({title:'Wuthering Heights'})
UPDATE `Books` .where `ID=201` .with `title='Sturmhöhe'`
DELETE.from `Books` .where `ID=201`

// with parameters
const x: Number = 42
SELECT `a, ${x}` .from `${x}` .where `x = ${x}`
SELECT.one.from `${x}` .where `ID=${x}`
INSERT.into `${x}` .entries ({title:'Wuthering Heights'})
UPDATE `${x}` .where `ID=${x}` .with `title=${x}`
DELETE.from `${x}` .where `ID=${x}`

SELECT.from(Foos).forUpdate()
SELECT.from(Foos).forUpdate({wait: 5})
SELECT.from(Foos).forShareLock()

INSERT.into('Foos').values(1,2,3)
INSERT.into('Foos').values([1,2,3])
// @ts-expect-error
INSERT.into('Foos').values([[1,2,3]])
// @ts-expect-error
INSERT.into('Foos').values([],[])

// @ts-expect-error
INSERT.into('Foos').rows(1,2,3)
INSERT.into('Foos').rows([1,2,3])
INSERT.into('Foos').rows([[1,2,3]])
INSERT.into('Foos').rows([[1,2,3],[1,2]])
// @ts-expect-error
INSERT.into('Foos').values([[1,2,3]])
