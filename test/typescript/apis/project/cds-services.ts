import cds, { Service, Request, HandlerFunction, ApplicationService } from '@sap/cds'
import { Bars, Bar, Foo, Foos, unboundAction, boundAction, as, testType } from './dummy'
const model = cds.reflect({})
const { Book: Books } = model.entities
import express from 'express'

// connect
let srv = await cds.connect.to('service')
cds.connect.to ('sqlite:my.db')
srv = await cds.connect.to('service', { credentials: {}, kind: 'odata', model: 'model' })
cds.connect.to('auth', {impl: ''})
cds.connect.to('auth', {service: 'BusinessPartnerService'})
cds.connect.to({kind: 'odata', model:'some/imported/model', service: 'BusinessPartnerService' })
cds.connect.to({ kind:'sqlite', credentials:{database:'my.db'} })
cds.connect.to(class CustomService extends Service {}) // cds-typer scenario
const dbSrv = await cds.connect.to('db')
dbSrv.deploy() // only valid if it's a DatabaseService

// legacy
cds.connect('db')
cds.connect({ credentials: {}, kind: 'sql', model: 'model' })
cds.connect({kind: 'odata', model:'some/imported/model', service: 'BusinessPartnerService' })

// basic properties
srv.name.length
srv.entities[0] = Books // same type
srv.entities('namespace')
srv.events('namespace')
srv.types('namespace')
srv.operations('namespace')

await srv.init()

srv.before("READ", "", async req => {
  req
    ?.query
    ?.SELECT
    ?.orderBy
    ?.[0]
    ?.ref  // should be there from expr
})

cds.serve('SomeService')
cds.serve('SomeService', {})
cds.serve('SomeService', { service: '*' })
cds.serve('SomeService', { from: '*' })
cds.serve('SomeService', { service: '*', from: '*' })
cds.serve('SomeService', { someOtherOption: true })
cds.serve('SomeService').at('path').from('model').in(express()).to('protocol')

// CRUD
await srv.read(Books, 'ID')
await srv.create(Books)
await srv.create(Books, 'ID')
await srv.insert({}).into(Books)
await srv.update(Books)
await srv.update(Books, 'ID')
await srv.delete(Books)
await srv.delete(Books, 'ID')
await srv.delete(Books).where({ id: 123 })
await srv.upsert({}).into(Books)
await srv.read({} as unknown as cds.ref)
await srv.read({} as unknown as cds.ref, 42)

await cds.read(Books, 'ID')
await cds.create(Books)
await cds.create(Books, 'ID')
await cds.insert({}).into(Books)
await cds.update(Books)
await cds.update(Books, 'ID')
await cds.delete(Books)
await cds.delete(Books, 'ID')
await cds.delete(Books).where({ id: 123 })
await cds.read({} as unknown as cds.ref)
await cds.read({} as unknown as cds.ref, 42)
// GAP: has to be added in runtime, then types, then re-enable this test
// await cds.upsert({}).into(Books)

// as alias to the query methods
let fs1: Foos = await srv.read(Foos)
let f1: Foo = fs1.at(0)!
fs1 = await srv.read(Foos, 42)
f1 = fs1.at(0)!

const c: INSERT<Foos> = await srv.create(Foos)
const i: INSERT<Foos> = await srv.insert(Foos)
const u: UPDATE<Foos> = await srv.update(Foos)
const up: UPSERT<Foos> = await srv.upsert(Foos)
const d: DELETE<Foos> = await srv.delete(Foos)

// queries
const query = INSERT.into("Authors", { ID: 111, name: 'Mark Twain' })
await srv.run(query)
await srv.run([query, query])
await srv.run('SELECT * from Authors where name like ?', ['%Poe%'])
await srv.run('SELECT * from Authors where name like :name', { name: '%Poe%' })

srv.foreach({ SELECT: { from: { ref: ['Foo'] } }, elements: {} }, () => {})

await srv.stream({ SELECT: { from: { ref: ['Foo'] } }, elements: {} })
srv.stream('data').from('T').where({ ID: 1 }).getReader

await srv.emit('UPDATE', {}, {})
await srv.emit(Books, {}, {})

// method, path
await srv.send({ method: 'READ', path: 'Authors' })
await srv.send({ method: 'READ', path: 'Authors', headers: {} })
await srv.send({ method: 'POST', path: 'Authors', data: {} })
await srv.send({ method: 'POST', path: 'Authors', data: {}, headers: {} })

// query
await srv.send({ query, headers: {} })
await srv.send({ query: INSERT.into('Authors', { ID: 111, name: 'Mark Twain' }) })

const { NetworkGroups: networkGroups } = srv.entities;
// event
await srv.send({ event: 'READ' })
await srv.emit({ event: 'UPDATE', data: {} })
await srv.send({ event: 'AuthorCreated', data: {}, headers: {} })
await srv.send({ event: 'feeEstimation', entity: networkGroups, data: {name:'Volta'}})
await srv.send({ event: 'feeEstimation', entity: networkGroups, data: {name:'Volta'}, params: {my: 7,new: 8}})
await srv.send({ event: 'feeEstimation', entity: networkGroups, data: {name:'Volta'}, params: {my: 7,new: 8}, headers: {accept: 'application/json'}})

// single args
await srv.send('CREATE', 'Books', {}, {})
await srv.send('POST', 'Books', {})
await srv.send('READ', 'Books')
await srv.send('boundAction', 'Books', { book: 251, quantity: 1 })
await srv.send('unboundAction', { book: 251, quantity: 1 })

// schedule + flush
await srv.schedule({ method: 'READ', path: 'Authors' }).after(1000 /* ms */)
await srv.schedule({ query, headers: {} }).every(2, 's')
await srv.schedule({ event: 'READ' }).after('1h')
await srv.schedule('CREATE', 'Books', {}, {}).every('3d')
await srv.schedule('CREATE', 'Books', {}, {}).every('3d').after('1h')
await srv.flush()
const badSchedule = srv.schedule({ method: 'READ', path: 'Authors' })
// @ts-expect-error - after() and every() should be called at most once
badSchedule.after(42).after(42)
// @ts-expect-error
badSchedule.every(42).every(42)
// @ts-expect-error
badSchedule.every(42).after(42).every(42)
// @ts-expect-error
badSchedule.after(42).every(42).after(42)


// TX
let tx = cds.tx({})
tx = cds.transaction({})
await tx.send({ query })
cds.transaction({tenant: 'myTenant'}, async (tx) => {
  // code here
})

// spawn
let job = cds.spawn({ tenant:'t0', every: 1000 /* ms */ }, async (tx) => {
  const mails = await SELECT.from('Outbox')
  await DELETE.from('Outbox').where ({ id: 123 })
})
job.on('succeeded', (res)=>console.log('succeeded' + res))
job.on('failed', (error)=>console.log('failed' + error))
job.on('done', ()=>console.log('done'))
job.timer

// draft
SELECT.from(Foo.drafts)

// provider
srv.before('*', Books, req => {
  req.data
  if (req.query.SELECT?.columns?.length ?? 0 > 0) {
    console.log("foooooooo")
  }

  req.query.elements['foo'].type
})
srv.before('*', async req => {
  req.event
  req.data
  req.headers

  req.info(1, 'msg', 'target', ['key1', 'key2'])
  req.error(1, 'msg', 'target', [1,2])
  req.error(1, 'target', [])
  req.error(1, 'msg')
  req.notify(1, 'msg', 'target', ['key', 2])
  req.warn(1, 'msg', 'target', [])
  const thing: number | undefined = 42 as number | undefined
  // @ts-expect-error  possibly undefined - goes away after req.reject
  thing.toExponential()
  if(!thing) req.reject(1, 'msg', 'target', [])
  // @ts-expect-error - ts SHOULD infer anything to not be undefined. But for some reason, having a _method_ of :never behaves differently than just a function
  thing.toExponential()

  req.error({ code: 'code', status: 404, message: 'message', args: [3,4] })

  req.id
  req.timestamp
  req.locale
  req.user
  req.tenant
  req.target.name
  req.entity
})

srv.after('*', (results, req) => {
  req.data
  results[0]
})
srv.after('UPDATE', Books, (results, req) => {
  req.data
  results[0]
})

srv.on("action1", req => {
  UPDATE(req.subject).with({ x: "a" })
  UPDATE(req.subject).with({ x: { "=": 4 } })
  UPDATE(req.subject).with({ x: { xpr: [{ ref: ["asdf"] }, "||", "asdf"] } })
  UPDATE(req.target).with({ x: 4 })
  UPDATE(req.target).with({ x: { "=": 4 } })
  UPDATE(req.target).with({ x: { xpr: [{ ref: ["asdf"] }, "||", "asdf"] } })
})

srv.on('CREATE', (req, next) => {
  req.data
  next()
})
srv.on('CREATE', Books, (req, next) => {
  req.data
  next()
})

// special error handler
srv.on('error', (err, req) => {
  err.message
  req.event
})


function isOne(p: Request<Foo> | Foo | undefined ) { if(!p) return; p instanceof Foo ? p.x.toFixed : p.data.x.toFixed}
function isMany(p: Request<Foos> | Foos | undefined) { if(!p) return; p instanceof Foos ? p[0].x.toFixed : p.data[0].x.toFixed}

function isOneOfMany(p: Request<Foo | Bar> | Foo | Bar | undefined ) {
  if(!p) return;
  if ("data" in p) {
    if (p.data instanceof Foo) p.data.x.toFixed;
    else p.data.name.split;
  } else {
    if (p instanceof Foo) p.x.toFixed;
    else p.name.split;
  }
}
function isManyOfMany(p: Request<Foos | Bars> | Foos | Bars | undefined) {
  if(!p) return;
  if ("data" in p) {
    if (p.data instanceof Foos) p.data[0].x.toFixed;
    else p.data[0].name.split;
  } else {
    if (p instanceof Foos) p[0].x.toFixed;
    else p[0].name.split;
  }
}

// Typed bound/ unbound actions
// The handler must return a number to be in line with action's signature (or void)
srv.on(unboundAction, req => req.data.foo.x)
srv.on(unboundAction, 'FooService', req => req.data.foo.x)

srv.on(boundAction, req => {
  testType<Foo>(req.subject)
  req.subject.x
})

srv.on('CREATE', Foo, (req, next) => { isOne(req); return next() })
srv.on('CREATE', Foos, (req, next) => { isOne(req); return next() })
srv.before('CREATE', Foo, req => { isOne(req); return req.data })
srv.before('CREATE', Foos, req => isOne(req))
srv.after('CREATE', Foo, (data) => { isOne(data); return data })
srv.after('CREATE', Foos, (data) => isOne(data))

srv.on('CREATE', [Foo, Bar], (req, next) => { isOneOfMany(req); return next() })
srv.on('CREATE', [Foos, Bars], (req, next) => { isOneOfMany(req); return next() })
srv.before('CREATE', [Foo, Bar], req => { isOneOfMany(req); return req.data })
srv.before('CREATE', [Foos, Bars], req => { isOneOfMany(req); return req.data })
srv.after('CREATE', [Foo, Bar], (data) => { isOneOfMany(data); return data })
srv.after('CREATE', [Foos, Bars], (data) => { isOneOfMany(data); return data })

// Handlers with classes. Singular and plural are to be reflected in what the handler receives
srv.on('READ', Foo, (req, next) => { isOne(req); return next() })
srv.on('READ', Foos, (req, next) => { isOne(req); return next() })
srv.before('READ', Foo, req => { isOne(req); return req.data })
srv.before('READ', Foos, req => isOne(req))
srv.after('READ', Foo, (data) => { isOne(data); return data })
srv.after('READ', Foos, (data) => isMany(data))

srv.after("each", Foos, (data) => { isOne(data); return data })
srv.after("each", Foo, (data) => { isOne(data); return data })

srv.on('READ', [Foo, Bar], (req, next) => { isOneOfMany(req); return next() })
srv.on('READ', [Foos, Bars], (req, next) => { isOneOfMany(req); return next() })
srv.before('READ', [Foo, Bar], req => { isOneOfMany(req); return req.data })
srv.before('READ', [Foos, Bars], req => isOneOfMany(req))
srv.after('READ', [Foo, Bar], (data) => { isOneOfMany(data); return data })
srv.after('READ', [Foos, Bars], (data) => isManyOfMany(data))

srv.after("each", [Foos, Bars], (data) => { isOneOfMany(data); return data })
srv.after("each", [Foo, Bar], (data) => { isOneOfMany(data); return data })

srv.on('UPDATE', Foo, (req, next) => { isOne(req); return next() })
srv.on('UPDATE', Foos, (req, next) => { isOne(req); return next() })
srv.before('UPDATE', Foo, req => { isOne(req); return req.data })
srv.before('UPDATE', Foos, req => isOne(req))
srv.after('UPDATE', Foo, (data) => { isOne(data); return data })
srv.after('UPDATE', Foos, (data) => isOne(data))

srv.on('UPDATE', [Foo, Bar], (req, next) => { isOneOfMany(req); return next() })
srv.on('UPDATE', [Foos, Bars], (req, next) => { isOneOfMany(req); return next() })
srv.before('UPDATE', [Foo, Bar], req => { isOneOfMany(req); return req.data })
srv.before('UPDATE', [Foos, Bars], req => isOneOfMany(req))
srv.after('UPDATE', [Foo, Bar], (data) => { isOneOfMany(data); return data })
srv.after('UPDATE', [Foos, Bars], (data) => isOneOfMany(data))

srv.on('DELETE', Foo, (req, next) => { isOne(req); return next() })
srv.on('DELETE', Foos, (req, next) => { isOne(req); return next() })
srv.before('DELETE', Foo, req => { isOne(req); return req.data })
srv.before('DELETE', Foos, req => isOne(req))
srv.after('DELETE', Foo, (data) => { isOne(data); return data })
srv.after('DELETE', Foos, (data) => isOne(data))

srv.on('DELETE', [Foo, Bar], (req, next) => { isOneOfMany(req); return next() })
srv.on('DELETE', [Foos, Bars], (req, next) => { isOneOfMany(req); return next() })
srv.before('DELETE', [Foo, Bar], req => { isOneOfMany(req); return req.data })
srv.before('DELETE', [Foos, Bars], req => isOneOfMany(req))
srv.after('DELETE', [Foo, Bar], (data) => { isOneOfMany(data); return data })
srv.after('DELETE', [Foos, Bars], (data) => isOneOfMany(data))

srv.on('READ', Foo, req => {
  req.before('commit', ()=>{})
  // @ts-expect-error
  req.before('anything else', ()=>{})
  req.on('done', ()=>{})
  req.on('failed', ()=>{})
  req.on('succeeded', ()=>{})
  // @ts-expect-error
  req.on('anything else', ()=>{})
})


// unbound
srv.before(unboundAction, (req) => {
  req.data.foo
  return 42
})

srv.after(unboundAction, (a,b) => {
  a?.foo.x === b.data.foo.x
  return 42
})

// bound
srv.before(unboundAction, 'someservice', (req) => {
  req.data.foo
  return 42
})

srv.after(unboundAction, 'someservice', (a,b) => {
  a?.foo.x === b.data.foo.x
  return 42
})


srv.before("UPDATE", "TestEntity", async (req) => {
  await SELECT.one.from(req.subject)
  await SELECT.from(req.subject)
  await DELETE.from(req.subject)
  await DELETE(req.subject)
  await UPDATE(req.subject)
})

srv.prepend(service => {
  service = srv // same type
})
srv.prepend(function () {
  srv = this // same type
})

srv.reject('', Books, 'Authors')

type ReturnType = {
  result: string
}
// should use the provided type as return type
const res1 = await srv.put<ReturnType>(Books)
res1.result.replace('a', 'b') // proves it is a string

// uses any if no return type provided
const res2 = await srv.put(Books)
res2.any


// app.use
const proxy = require('@cap-js-community/odata-v2-adapter')
cds.on('bootstrap', (app): void => {
  app.use(proxy({ port: process.env.PORT }))
})

.on('shutdown', () => {
  console.log("shutdown")
})
.once('shutdown', () => {
  console.log("shutdown")
})


// cds.context.http
if (cds.context?.http) {
  const { req , res } = cds.context!.http
  if (!req.headers.authentication)
    res.status(403).send('Please login')
  if (!req.is('application/json')) res.send(415)
  req.headers['x-correlation-id'] = cds.context!.id
}
const req3 = cds.context?.http?.req

let ctx = cds.context
ctx?.tenant === 't1'
const myUser = ctx?.user
if (myUser instanceof cds.User) {
  myUser.id === 'u2'
}

cds.context = { tenant:'t1', user: new cds.User('u2'), locale: 'en_GB', id: 'aaaa', timestamp: new Date(), model: ctx!.model }
const tx3 = cds.tx (cds.context)
const db = await cds.connect.to('db')
cds.context!.features = {foo: true}

cds.tx({tenant: 'myTenant'}, async (tx) => { // tx has to be infered from the type defintion to be a Transaction type
  await tx.run('').then(() => {}, () => {})
  // code here
}).then(() => {}, () => {})

cds.tx(async (tx) => { // tx has to be infered from the type defintion to be a Transaction type
  await tx.run('').then(() => {}, () => {})
  // code here
}).then(() => {}, () => {})

//tests cds.db
cds.db.kind === "hana"
await cds.db.run ( SELECT.from(Books) )
await cds.tx (async (tx) => {
  await tx.run(SELECT(1).from(Books,201).forUpdate())
})
cds.db.entities('draftModelAuth')

//tests outbox
const outboxedService = cds.outboxed(srv)
await outboxedService.send({ event: 'feeEstimation', entity: networkGroups, data: {name:'Volta'}})
await cds.unboxed(outboxedService).send({ event: 'feeEstimation', entity: networkGroups, data: {name:'Volta'}})

srv.entities('namespace');
[...srv.entities('namespace')].map(e => e.keys); // .keys only available on entities
// @ts-expect-error
[...srv.events('namespace')].map(e => e.keys);
[...srv.events('namespace')].map(e => e.elements)

// @ts-expect-error
srv.entities('namespace')('and again')

type ActionType = HandlerFunction<typeof unboundAction>
srv.on(unboundAction, externalActionHandler)
function externalActionHandler(req: ActionType['parameters']['req']): ActionType['returns'] {
  testType<Foo>(req.data.foo)
  return 42
}

testType<number>(externalActionHandler(as<HandlerFunction<typeof unboundAction>['parameters']['req']>()))


const msg = await cds.connect.to('CatalogService');
// no negative tests, see comment in types for emit
msg.emit(Foo, { x: 11 })
msg.emit(Foos, { x: 11, bar: '22' })
msg.emit(Foos, { x: 11 })

const asrv = srv as ApplicationService
await asrv.new(Foo.drafts, {x: 42})
// @ts-expect-error y not a valid property
await asrv.new(Foo.drafts, {y: 42})
await asrv.discard(Foo.drafts, [1,2])
await asrv.edit(Foo, [1,2])
await asrv.new(Foo.drafts).for([1,2])
await asrv.save(Foo.drafts, [1,2])

asrv.on('', (req) => {
  asrv.dispatch(req)
  asrv.dispatch([req])
})
asrv.dispatch('foo')
asrv.dispatch(['foo', 'bar'])