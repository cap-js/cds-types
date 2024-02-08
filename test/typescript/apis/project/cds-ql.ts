import { QLExtensions } from '../../../../apis/ql'
import { Foo, Foos, attach } from './dummy'

// unwrapped plural types
let sel: SELECT<Foo>
sel = SELECT(Foo)
sel = SELECT(Foo, 42)
sel = SELECT(Foo.drafts)
sel = SELECT(Foos.drafts)
sel = SELECT.from(Foo.drafts)
sel = SELECT.from(Foos.drafts)
sel = SELECT.from(Foos.drafts, 42)

const selStatic: SELECT<Foos> | Promise<Foos> = SELECT.from(Foos)

SELECT.from(Foos).columns("x") // x was suggested by code completion
sel.from(Foos)
sel.columns(``).where(['asd'])
sel.columns(``)  // template strings from Columns interface still works
sel.columns("x") // x was suggested by code completion
sel.SELECT.columns?.filter(e => !e) // check if this is array

// ensure ql returns a proper CQN
const s = SELECT.from(Foos).columns('ID').where('ID =', 42)
s.SELECT.from.ref
s.SELECT.columns?.[0].ref
s.SELECT.where?.[0].ref
s.SELECT.where?.[2].val

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
// uniform behaviour for all variants
upd = UPDATE.entity(Foos)
upd = UPDATE.entity(Foo)
upd = UPDATE.entity(new Foo)

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
// explicitly select one
selectOne = await SELECT.one.from(Foos)
selectOne = await SELECT.one.from(Foos, 42)
selectOne = await SELECT.one.from(Foos, 42, f => f.x)
selectOne = await SELECT.one.from(Foos, f => f.x)
selectOne = await SELECT.one.from(Foos).alias('Bars')
// implicitly select one by specifying a key
selectOne = await SELECT.from(Foos, 42)
selectOne = await SELECT.from(Foos, 42, (f: Foo) => f.x)

selectMany = await SELECT.from(Foos)
selectMany = await SELECT.from(Foos, (f: Foo) => f.x)
selectMany = await SELECT.from(Foos).alias('Bars')
await SELECT.from(Foos, f => attach(f.ref)('*'))

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

SELECT.from(Foos).columns(f => {
    const iterator: QLExtensions<Foo> = f
    const number: QLExtensions<number> = f.x
})

SELECT.from(Foos).columns(['entityIDColumn', 'parentIDColumn'])
SELECT.from(Foos).columns('entityIDColumn', 'parentIDColumn')
SELECT.from(Foos).columns([{ ref: ['entityIDColumn'] }])
SELECT.from(Foos).columns({ ref: ['entityIDColumn'] })
SELECT.from `Books` .columns ( 'title', {ref:['author','name'],as:'author'} )
SELECT.from `Books` .columns (['title', {ref:['author','name'],as:'author'} ])

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
