import { Definition } from '../../../../apis/csn';
import { QLExtensions } from '../../../../apis/ql'
import { linked } from '../../../../apis/models';
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
ins = INSERT.into(Foos, { x: 4 })
ins.into(Foos)
ins.into(Foos)
ins.columns("x") // x was suggested by code completion
ins.INSERT.into === "foo"
INSERT.into("Bla").as(SELECT.from("Foo"))

let upd: UPDATE<Foo>
upd = UPDATE(Foo, 42)
upd.set({x:4})
upd = UPDATE.entity(Foos)
upd.set({x:1})
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

let selectOne: Foo | null
let selectMany: Foos

// SINGULAR TESTS
selectOne = await SELECT.from(Foos.drafts, 42) // .drafts of plural still singular
selectOne = await SELECT.from(Foo.drafts, 42)
selectOne = await SELECT(Foo, 42)
// explicitly select one
selectOne = await SELECT.one.from(Foo)
selectOne = await SELECT.one.from(Foo, 42)
selectOne = await SELECT.one.from(Foo, 42)
const xx = await SELECT.one(Foo, 42)
selectOne = await SELECT.one.from(Foo, 42, f => f.x)
selectOne = await SELECT.one.from(Foo, f => f.x)
selectOne = await SELECT.one.from(Foo).alias('Bars')
selectOne = await SELECT.one('').from(Foo)
selectOne = await SELECT.one``.from(Foo)

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
selectOne = await SELECT.one('').from(Foos)
selectOne = await SELECT.one``.from(Foos)
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

// deep projection nesting
SELECT.from(Foos, f => f.ref(r => r.ref(r => r.ref(r => {
    const x: number = r.x
}))))

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
SELECT.one.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r?.some)
SELECT.one.from(Foos).columns(['entityIDColumn', 'parentIDColumn']).then(r => r?.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r?.some)
SELECT.one.from(Foos).columns('entityIDColumn', 'parentIDColumn').then(r => r?.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r?.some)
SELECT.one.from(Foos).columns([{ ref: ['entityIDColumn'] }]).then(r => r?.ref)
// @ts-expect-error invalid key of result
SELECT.one.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r?.some)
SELECT.one.from(Foos).columns({ ref: ['entityIDColumn'] }).then(r => r?.ref)

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

// Type checks with typed INSERT
// @ts-expect-error - invalid property of Foo
INSERT.into(Foos).entries({ a: "" })
// @ts-expect-error - invalid property of Foo
INSERT.into(Foos).entries([{ a: "" }])
INSERT.into(Foos).entries({ x: 4, ref: { x: 4 }, refs: [] })
INSERT.into(Foo).entries({ x: 4 }, { x: 1 }, { x: 4, ref: { x: 1 } })
// @ts-expect-error - invalid type for property x of Foo
INSERT.into(Foo).entries({ x: "4" })
INSERT.into(Foo, { x: 4, ref: { x: 2 }})
INSERT.into(Foo, [{ x: 4 }])

INSERT.into("Foo", [{ x: "4" }])
INSERT.into("Foo", { x: "4" }, { "ref": "4" })

INSERT.into({} as Definition, { x : 4, "other": 5 }, { a : 4})
INSERT.into({} as Definition, [{ x : 4, "other": 5 }, { a : 4}])
INSERT.into({} as linked.classes.entity, { "a": 4 })

// Type checks with typed UPSERTs
// @ts-expect-error - invalid property of Foo
UPSERT.into(Foos).entries({ a: "" })
// @ts-expect-error - invalid property of Foo
UPSERT.into(Foos).entries([{ a: "" }])
UPSERT.into(Foos).entries({ x: 4, ref: { x: 4 }, refs: [] })
UPSERT.into(Foo).entries({ x: 4 }, { x: 1 }, { x: 4, ref: { x: 1 } })
// @ts-expect-error - invalid type for property x of Foo
UPSERT.into(Foo).entries({ x: "4" })
UPSERT.into(Foo, { x: 4, ref: { x: 2 }})
UPSERT.into(Foo, [{ x: 4 }])

UPSERT.into("Foo", [{ x: "4" }])
UPSERT.into("Foo", { x: "4" }, { "ref": "4" })

UPSERT.into({} as Definition, { x : 4, "other": 5 }, { a : 4})
UPSERT.into({} as Definition, [{ x : 4, "other": 5 }])

UPSERT.into({} as linked.classes.entity, { "a": 4 })

// UPDATE: checks with typed classes
UPDATE(Foo, 42).set({ x: 4}).where({ x: 44 })
UPDATE(Foos, 42).set({ x: 4}).where({ x: 44 })
// @ts-expect-error - invalid property of Foo
UPDATE(Foos, 4).set({ aa: 4 });
// @ts-expect-error - invalid property type of Foo.x
UPDATE(Foo).where({ x: 4 }).set({ x: 'asdf', ref: { x: 4 }})
UPDATE(Foos).where({ x: 4 }).set({ x: 4, ref: { x: 4 }})
UPDATE.entity(Foos).set({ x: 4});

UPDATE.entity(Foos).set({
  x: {'+=': 4 },
  ref: { x: 5 },
  y: { xpr: [{ ref: ["asdf"] }, "||", "asdf"] }
});

// @ts-expect-error - invalid operator of qbe expression
UPDATE(Foo).with({x: {'--': 4}})

// @ts-expect-error - invalid property name of xpr
UPDATE(Foos).with({x: {xpr: [{funcs: ""}]}})

// untyped, no syntax errors
UPDATE.entity("Foos").set({ test: {xp: "4"} });
UPDATE.entity({} as linked.classes.entity).set({ asdf: 434 });
UPDATE`Foos`.set`x = 4`.where`x > 10`